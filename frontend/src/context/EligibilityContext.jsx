import React, { createContext, useContext, useState } from 'react';
import { eligibilityAPI } from '../services/api';

const EligibilityContext = createContext();

export const defaultProfile = {
  age: 25,
  gender: 'Male',
  state: 'Uttar Pradesh',
  district: 'Lucknow',
  annual_income: 200000,
  occupation: 'Student',
  employment_status: 'Unemployed',
  category: 'OBC',
  disability_status: false,
  marital_status: 'Single',
  student: true,
  farmer: false,
  bpl: true,
  senior_citizen: false,
  widow: false,
  pregnant: false,
  rural_resident: true,
  entrepreneur: false,
};

export const demoProfile = {
  age: 22,
  gender: 'Male',
  state: 'Uttar Pradesh',
  district: 'Lucknow',
  annual_income: 240000,
  occupation: 'Student',
  employment_status: 'Student',
  category: 'OBC',
  disability_status: false,
  marital_status: 'Single',
  student: true,
  farmer: false,
  bpl: true,
  senior_citizen: false,
  widow: false,
  pregnant: false,
  rural_resident: true,
  entrepreneur: false,
};

export const EligibilityProvider = ({ children }) => {
  const [profile, setProfile] = useState(defaultProfile);
  const [matchResults, setMatchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateProfileField = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const loadDemoProfile = () => {
    setProfile(demoProfile);
  };

  const runEligibilityCheck = async (profileData = profile) => {
    setLoading(true);
    try {
      const res = await eligibilityAPI.match(profileData);
      setMatchResults(res.data);
      return res.data;
    } catch (err) {
      console.error('Eligibility check error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <EligibilityContext.Provider value={{
      profile,
      setProfile,
      updateProfileField,
      loadDemoProfile,
      matchResults,
      runEligibilityCheck,
      loading
    }}>
      {children}
    </EligibilityContext.Provider>
  );
};

export const useEligibility = () => useContext(EligibilityContext);
