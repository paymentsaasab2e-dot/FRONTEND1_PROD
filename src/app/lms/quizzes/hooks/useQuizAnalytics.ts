import { useMemo } from 'react';
import { useLmsState } from '../../state/LmsStateProvider';
import { lmsQuizBank, quizzesCatalog } from '../../data/ai-mock';

export function useQuizAnalytics() {
  const { state } = useLmsState();
  const attempts = state.quizAttempts;

  return useMemo(() => {
    const attemptEntries = Object.entries(attempts);
    const hasAttempts = attemptEntries.length > 0;

    let totalScore = 0;
    let mostRecentScore = 0;
    let mostRecentDate = 0;
    let mostRecentQuizId: string | null = null;
    const scoresByTopic: Record<string, number[]> = {};

    for (const [quizId, attempt] of attemptEntries) {
      totalScore += attempt.score;
      if (attempt.completedAt > mostRecentDate) {
        mostRecentDate = attempt.completedAt;
        mostRecentScore = attempt.score;
        mostRecentQuizId = quizId;
      }
      const quiz = lmsQuizBank[quizId];
      if (quiz) {
        const topic = quiz.skill;
        if (!scoresByTopic[topic]) scoresByTopic[topic] = [];
        scoresByTopic[topic].push(attempt.score);
      }
    }

    const avgScore = hasAttempts ? Math.round(totalScore / attemptEntries.length) : 0;
    const recentScoreStr = hasAttempts ? `${mostRecentScore}` : '-';

    // Topic aggregates
    const topicAverages: Record<string, number> = {};
    for (const [topic, scores] of Object.entries(scoresByTopic)) {
      topicAverages[topic] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }

    // Find weakest topic
    let weakestTopic = '';
    let lowestScore = 100;
    for (const [topic, score] of Object.entries(topicAverages)) {
      if (score < lowestScore) {
        lowestScore = score;
        weakestTopic = topic;
      }
    }

    // Identify weak quizzes to retry that exist in catalog and map them
    const retryQuizzes = quizzesCatalog
      .filter((q) => {
        const bank = lmsQuizBank[q.id];
        return bank && topicAverages[bank.skill] !== undefined && topicAverages[bank.skill] < 70;
      })
      .slice(0, 4);

    return {
      hasAttempts,
      avgScore,
      recentScore: hasAttempts ? mostRecentScore : null,
      recentScoreStr,
      recentQuizId: hasAttempts ? mostRecentQuizId : null,
      topicAverages,
      weakestTopic,
      lowestScore,
      retryQuizzes,
      attemptCount: attemptEntries.length,
      lastAttemptDate: mostRecentDate,
    };
  }, [attempts]);
}
