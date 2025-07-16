import React, { useEffect } from 'react';
import Flights from '../screens/Flights';
import { useLoader } from './_layout';

export default function FlightsTab() {
  const { hide } = useLoader();
  useEffect(() => { hide(); }, []);
  return <Flights />;
} 