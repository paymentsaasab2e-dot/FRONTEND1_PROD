'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface BasicInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BasicInfoData) => void | Promise<void>;
  initialData?: BasicInfoData;
}

export interface BasicInfoData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCode: string;
  gender: string;
  dob: string;
  country: string;
  city: string;
  employment: string;
  passportNumber?: string;
}

export default function BasicInfoModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: BasicInfoModalProps) {
  const [firstNameValue, setFirstNameValue] = useState(initialData?.firstName || '');
  const [middleNameValue, setMiddleNameValue] = useState(initialData?.middleName || '');
  const [lastNameValue, setLastNameValue] = useState(initialData?.lastName || '');
  const [emailValue, setEmailValue] = useState(initialData?.email || '');
  const [phoneValue, setPhoneValue] = useState(initialData?.phone || '');
  const [phoneCode, setPhoneCode] = useState(initialData?.phoneCode || '+1 (USA)');
  const [genderValue, setGenderValue] = useState(initialData?.gender || '');
  const [dobValue, setDobValue] = useState(initialData?.dob || '');
  const [countryValue, setCountryValue] = useState(initialData?.country || '');
  const [cityValue, setCityValue] = useState(initialData?.city || '');
  const [employmentValue, setEmploymentValue] = useState(initialData?.employment || '');
  const [passportNumberValue, setPassportNumberValue] = useState(initialData?.passportNumber || '');
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Update values when initialData changes
  useEffect(() => {
    if (initialData) {
      setFirstNameValue(initialData.firstName || '');
      setMiddleNameValue(initialData.middleName || '');
      setLastNameValue(initialData.lastName || '');
      setEmailValue(initialData.email || '');
      setPhoneValue(initialData.phone || '');
      setPhoneCode(initialData.phoneCode || '+1 (USA)');
      setGenderValue(initialData.gender || '');
      setDobValue(initialData.dob || '');
      setCountryValue(initialData.country || '');
      setCityValue(initialData.city || '');
      setEmploymentValue(initialData.employment || '');
      setPassportNumberValue(initialData.passportNumber || '');
    } else {
      // Clear all fields for "Add" mode
      setFirstNameValue('');
      setMiddleNameValue('');
      setLastNameValue('');
      setEmailValue('');
      setPhoneValue('');
      setPhoneCode('+1 (USA)');
      setGenderValue('');
      setDobValue('');
      setCountryValue('');
      setCityValue('');
      setEmploymentValue('');
      setPassportNumberValue('');
    }
  }, [initialData, isOpen]);

  const handleSave = async () => {
    await onSave({
      firstName: firstNameValue,
      middleName: middleNameValue,
      lastName: lastNameValue,
      email: emailValue,
      phone: phoneValue,
      phoneCode,
      gender: genderValue,
      dob: dobValue,
      country: countryValue,
      city: cityValue,
      employment: employmentValue,
      passportNumber: passportNumberValue,
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow || 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999]">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        />

        {/* Drawer */}
        <div
          className="fixed top-0 right-0 z-[10000] flex h-full w-full max-w-[520px] flex-col border-l border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.2)] transform transition-all duration-300 ease-out translate-x-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Edit Basic Information' : 'Add Basic Information'}
            </h2>
            <button
              onClick={onClose}
              className="text-[#9095A1] hover:text-gray-600"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-8">
              {/* Section 1 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">First Name</label>
                    <input
                      type="text"
                      value={firstNameValue}
                      onChange={(e) => setFirstNameValue(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-200 px-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Middle Name</label>
                    <input
                      type="text"
                      value={middleNameValue}
                      onChange={(e) => setMiddleNameValue(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-200 px-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter middle name"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-medium text-gray-500">Last Name</label>
                    <input
                      type="text"
                      value={lastNameValue}
                      onChange={(e) => setLastNameValue(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-200 px-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="space-y-4 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-medium text-gray-500">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={emailValue}
                        onChange={(e) => setEmailValue(e.target.value)}
                        className="h-11 w-full rounded-lg border border-gray-200 px-3 pr-24 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter email address"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-600">
                        Verified
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-medium text-gray-500">Phone Number</label>
                    <div className="grid grid-cols-[140px_1fr] gap-2">
                      <select
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                        className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                      >
                        <option>+1 (USA)</option>
                        <option>+44 (UK)</option>
                        <option>+91 (India)</option>
                      </select>
                      <input
                        type="tel"
                        value={phoneValue}
                        onChange={(e) => setPhoneValue(e.target.value)}
                        className="h-11 w-full rounded-lg border border-gray-200 px-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="space-y-4 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Basic Details
                </h3>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Gender</label>
                    <select
                      value={genderValue}
                      onChange={(e) => setGenderValue(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Date of Birth</label>
                    <div className="relative">
                      <div
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                        onClick={() => dateInputRef.current?.showPicker()}
                      >
                        <Image
                          src="/calendar_icon.png"
                          alt="Calendar"
                          width={16}
                          height={16}
                          className="h-4 w-4"
                        />
                      </div>
                      <input
                        ref={dateInputRef}
                        type="date"
                        value={dobValue}
                        onChange={(e) => setDobValue(e.target.value)}
                        onClick={() => dateInputRef.current?.showPicker()}
                        className="h-11 w-full rounded-lg border border-gray-200 px-3 pl-10 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section className="space-y-4 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </h3>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Current City</label>
                    <input
                      type="text"
                      value={cityValue}
                      onChange={(e) => setCityValue(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-200 px-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter current city"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Current Country</label>
                    <select
                      value={countryValue}
                      onChange={(e) => setCountryValue(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    >
                      <option value="">Select Country</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>India</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="space-y-4 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Professional Status
                </h3>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Employment Status</label>
                    <select
                      value={employmentValue}
                      onChange={(e) => setEmploymentValue(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    >
                      <option value="">Select Status</option>
                      <option>Employed</option>
                      <option>Unemployed</option>
                      <option>Self-Employed</option>
                      <option>Student</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Passport Number</label>
                    <input
                      type="text"
                      value={passportNumberValue}
                      onChange={(e) => setPassportNumberValue(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-200 px-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter passport number"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}