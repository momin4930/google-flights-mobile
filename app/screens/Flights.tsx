import BottomNavBar from '@/components/BottomNavBar';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const CARD_BG = 'rgba(20,34,54,0.97)';
const INPUT_BG = 'rgba(34,51,77,1)';
const BORDER_COLOR = '#334e68';
const BUTTON_BG = '#1e3c72';
const BUTTON_TEXT = '#e6f0fa';
const PLACEHOLDER_COLOR = '#7a8fa6';

// --- Sky-Scrapper API constants (commented out) ---
// const API_URL = 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights';
// const AIRPORT_API_URL = 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport';

// --- Amadeus API constants ---
const AMADEUS_CLIENT_ID = process.env.EXPO_PUBLIC_AMADEUS_CLIENT_ID || Constants.expoConfig?.extra?.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.EXPO_PUBLIC_AMADEUS_CLIENT_SECRET || Constants.expoConfig?.extra?.AMADEUS_CLIENT_SECRET;
const AMADEUS_AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';
const AMADEUS_FLIGHT_SEARCH_URL = 'https://test.api.amadeus.com/v2/shopping/flight-offers';

const Flights = () => {
  // --- Old city state (city names) ---
  // const [originCity, setOriginCity] = useState('');
  // const [destinationCity, setDestinationCity] = useState('');
  // --- New: Use IATA codes directly ---
  // const [originIata, setOriginIata] = useState('');
  // const [destinationIata, setDestinationIata] = useState('');
  // --- New: Use city names ---
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  // --- Old Sky-Scrapper state (commented out) ---
  // const [originSkyId, setOriginSkyId] = useState<string | null>(null);
  // const [destinationSkyId, setDestinationSkyId] = useState<string | null>(null);
  // const [originEntityId, setOriginEntityId] = useState<string | null>(null);
  // const [destinationEntityId, setDestinationEntityId] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1 = IATA input, 2 = details form
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [passengers, setPassengers] = useState('1');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searchCardCollapsed, setSearchCardCollapsed] = useState(false); // <-- NEW

  // --- Amadeus Token State ---
  const [amadeusToken, setAmadeusToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);

  // Prefill destinationCity from route params if present
  const params = useLocalSearchParams();
  useEffect(() => {
    if (params.destinationCity && !destinationCity) {
      setDestinationCity(String(params.destinationCity));
    }
  }, [params.destinationCity]);

  const textColor = useThemeColor({}, 'text');
  let lottieSource;
  try {
    lottieSource = require('@/assets/images/loader-lottie.json');
  } catch (e) {
    lottieSource = null;
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // --- Amadeus: Fetch OAuth2 Token ---
  const fetchAmadeusToken = async () => {
    if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET) {
      throw new Error('Missing Amadeus API credentials.');
    }
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', AMADEUS_CLIENT_ID);
    params.append('client_secret', AMADEUS_CLIENT_SECRET);
    const response = await fetch(AMADEUS_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error('Failed to get Amadeus token: ' + (data.error_description || response.status));
    setAmadeusToken(data.access_token);
    setTokenExpiry(Date.now() + (data.expires_in - 60) * 1000); // expire 1 min early
    return data.access_token;
  };

  // --- Helper: Get valid token (refresh if needed) ---
  const getValidAmadeusToken = async () => {
    if (amadeusToken && tokenExpiry && Date.now() < tokenExpiry) {
      return amadeusToken;
    }
    return await fetchAmadeusToken();
  };

  // --- Old getCityAirportInfo (commented out) ---
  /*
  const getCityAirportInfo = async (city: string) => {
    const params = new URLSearchParams({ query: city });
    const response = await fetch(`${AIRPORT_API_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': Constants.expoConfig?.extra?.RAPIDAPI_KEY || Constants.manifest?.extra?.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
      },
    });
    const text = await response.text();
    if (!response.ok) throw new Error('Failed to fetch airport/city info: ' + text);
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error('Failed to parse airport/city response.');
    }
    console.log(`Lookup for city: ${city}`, data?.data); // <-- LOG lookup results
    if (data?.data?.length > 0) {
      // Prefer city-level result, fallback to first
      const cityMatch = data.data.find((item: any) => item.type === 'CITY');
      const match = cityMatch || data.data[0];
      return { skyId: match.skyId, entityId: match.entityId };
    }
    throw new Error('No matching city/airport found for ' + city);
  };
  */

  // --- Old onLookupCities (commented out) ---
  /*
  const onLookupCities = async () => {
    setSearching(true);
    setError('');
    try {
      const [originInfo, destInfo] = await Promise.all([
        getCityAirportInfo(originCity.trim()),
        getCityAirportInfo(destinationCity.trim()),
      ]);
      console.log('Origin Info:', originInfo); // <-- LOG origin info
      console.log('Destination Info:', destInfo); // <-- LOG destination info
      setOriginSkyId(originInfo.skyId);
      setOriginEntityId(originInfo.entityId);
      setDestinationSkyId(destInfo.skyId);
      setDestinationEntityId(destInfo.entityId);
      setStep(2);
    } catch (e: any) {
      setError(e?.message || 'Failed to find city/airport.');
    } finally {
      setSearching(false);
    }
  };
  */

  // --- New: onLookupCities (validates city names, fetches airport codes) ---
  const onLookupCities = async () => {
    setError('');
    if (!originCity.trim() || !destinationCity.trim()) {
      setError('Please enter both origin and destination cities.');
      return;
    }
    setSearching(true);
    try {
      const token = await getValidAmadeusToken();
      // Helper to fetch all airport IATA codes for a city
      const fetchAirportCodes = async (city: string): Promise<string[]> => {
        const url = `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${encodeURIComponent(city)}&page[limit]=10`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok || !data.data?.length) throw new Error(`No airports found for ${city}`);
        // Return unique IATA codes
        return Array.from(new Set(data.data.map((item: any) => item.iataCode as string)));
      };
      const [originIatas, destinationIatas]: [string[], string[]] = await Promise.all([
        fetchAirportCodes(originCity.trim()),
        fetchAirportCodes(destinationCity.trim()),
      ]);
      if (!originIatas.length || !destinationIatas.length) {
        setError('No airports found for one or both cities.');
        setSearching(false);
        return;
      }
      setStep(2);
      setOriginAirports(originIatas as string[]);
      setDestinationAirports(destinationIatas as string[]);
    } catch (e: any) {
      setError(e?.message || 'Failed to find airports for the cities.');
    } finally {
      setSearching(false);
    }
  };

  // --- New: State to hold airport codes for search step ---
  const [originAirports, setOriginAirports] = useState<string[]>([]);
  const [destinationAirports, setDestinationAirports] = useState<string[]>([]);

  // --- Old: onSearch (commented out) ---
  /*
  const onSearch = async () => {
    setSearching(true);
    setError('');
    setResults([]);
    try {
      if (!originSkyId || !destinationSkyId || !originEntityId || !destinationEntityId) {
        setError('Please select valid origin and destination.');
        setSearching(false);
        return;
      }
      const params = new URLSearchParams({
        originSkyId,
        destinationSkyId,
        originEntityId,
        destinationEntityId,
        date: formatDate(departureDate),
        cabinClass: 'economy',
        adults: passengers,
        sortBy: 'best',
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US',
      });
      console.log('SearchFlights Params:', Object.fromEntries(params)); // <-- LOG search params
      const response = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': Constants.expoConfig?.extra?.RAPIDAPI_KEY || Constants.manifest?.extra?.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
        },
      });
      const text = await response.text();
      console.log('SearchFlights Raw Response:', text); // <-- LOG raw response
      if (!response.ok) {
        setError(`API error: ${response.status} - ${text}`);
        setSearching(false);
        return;
      }
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setError('Failed to parse API response.');
        setSearching(false);
        return;
      }
      // Bot protection/CAPTCHA detection
      if (
        (data?.message && typeof data.message === 'object' && data.message.action === 'captcha') ||
        (typeof data?.message === 'string' && data.message.toLowerCase().includes('captcha'))
      ) {
        setError('API temporarily blocked due to rate limiting or bot protection. Please try again later or contact support.');
        setSearching(false);
        setSearchCardCollapsed(true);
        return;
      }
      if (data?.data?.itineraries?.length) {
        setResults(data.data.itineraries);
      } else {
        setError('No flights found.');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch flights.');
    } finally {
      setSearching(false);
      setSearchCardCollapsed(true);
    }
  };
  */

  // --- New: Search all airport pairs ---
  const onSearch = async () => {
    setSearching(true);
    setError('');
    setResults([]);
    try {
      if (!originAirports.length || !destinationAirports.length) {
        setError('No valid airports to search.');
        setSearching(false);
        return;
      }
      const token = await getValidAmadeusToken();
      const paramsBase = {
        departureDate: formatDate(departureDate),
        returnDate: formatDate(returnDate), // Always include returnDate for round trip
        adults: passengers,
        currencyCode: 'USD',
        max: 5, // limit per pair to avoid rate limits
      };
      // Build all pairs
      const pairs: [string, string][] = [];
      originAirports.forEach(o => destinationAirports.forEach(d => pairs.push([o, d])));
      // Limit to 10 pairs to avoid rate limits
      const limitedPairs = pairs.slice(0, 10);
      // Fetch all in parallel
      const allResults = await Promise.all(
        limitedPairs.map(async ([originIata, destinationIata]) => {
          const params = { ...paramsBase, originLocationCode: originIata, destinationLocationCode: destinationIata };
          const url = `${AMADEUS_FLIGHT_SEARCH_URL}?${new URLSearchParams(params as any).toString()}`;
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok && data?.data?.length) {
              // Attach airport info to each result
              return data.data.map((item: any) => ({ ...item, _origin: originIata, _destination: destinationIata }));
            }
            return [];
          } catch {
            return [];
          }
        })
      );
      // Flatten and set results
      const flatResults = allResults.flat();
      if (!flatResults.length) {
        setError('No flights found.');
      }
      setResults(flatResults);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch flights.');
    } finally {
      setSearching(false);
      setSearchCardCollapsed(true);
    }
  };

  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.centerContainer} keyboardShouldPersistTaps="handled">
        {/* Loader Animation */}
        {searching && (
          <View style={{ marginTop: 24, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {lottieSource ? (
              <LottieView source={lottieSource} autoPlay loop style={styles.loaderLottie} />
            ) : (
              <ActivityIndicator size="large" color={BUTTON_BG} />
            )}
            <ThemedText style={{ color: '#ccc', marginTop: 8 }}>Searching flights...</ThemedText>
          </View>
        )}
        {/* Step 1: City input */}
        {!searchCardCollapsed && !searching && step === 1 && (
          <View style={styles.card}>
            <ThemedText type="title" style={styles.title}>
              Enter Cities
            </ThemedText>
            <ThemedText style={{ color: '#7a8fa6', marginBottom: 8, textAlign: 'center' }}>
              Example: London, New York
            </ThemedText>
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="From (City Name)"
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={originCity}
              onChangeText={setOriginCity}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="To (City Name)"
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={destinationCity}
              onChangeText={setDestinationCity}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.button} onPress={onLookupCities} disabled={searching}>
              <ThemedText style={styles.buttonText}>OK</ThemedText>
            </TouchableOpacity>
            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
          </View>
        )}
        {/* Step 2: Details form */}
        {!searchCardCollapsed && !searching && step === 2 && (
          <View style={styles.card}>
            <ThemedText type="title" style={styles.title}>
              Search Flights
            </ThemedText>
            <ThemedText style={{ marginBottom: 8, color: '#7a8fa6', textAlign: 'center' }}>
              {originCity} → {destinationCity}
            </ThemedText>
            <TouchableOpacity onPress={() => setShowDeparturePicker(true)}>
              <ThemedText
                style={[styles.input, { paddingTop: 14, paddingBottom: 14, color: textColor }]}
              >
                Departure: {departureDate.toDateString()}
              </ThemedText>
            </TouchableOpacity>
            {showDeparturePicker && (
              <DateTimePicker
                value={departureDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, date) => {
                  setShowDeparturePicker(false);
                  if (date) setDepartureDate(date);
                }}
              />
            )}
            <TouchableOpacity onPress={() => setShowReturnPicker(true)}>
              <ThemedText
                style={[styles.input, { paddingTop: 14, paddingBottom: 14, color: textColor }]}
              >
                Return: {returnDate.toDateString()}
              </ThemedText>
            </TouchableOpacity>
            {showReturnPicker && (
              <DateTimePicker
                value={returnDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, date) => {
                  setShowReturnPicker(false);
                  if (date) setReturnDate(date);
                }}
              />
            )}
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Passengers"
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={passengers}
              onChangeText={setPassengers}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={onSearch} disabled={searching}>
              <ThemedText style={styles.buttonText}>
                {searching ? 'Searching...' : 'Search Flights'}
              </ThemedText>
            </TouchableOpacity>
            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
            <TouchableOpacity style={[styles.button, { backgroundColor: '#334e68', marginTop: 8 }]} onPress={() => { setStep(1); setOriginCity(''); setDestinationCity(''); setOriginAirports([]); setDestinationAirports([]); }}>
              <ThemedText style={styles.buttonText}>Change Cities</ThemedText>
            </TouchableOpacity>
          </View>
        )}
        {/* Expand Search Card Button */}
        {searchCardCollapsed && !searching && (
          <View style={styles.collapsedCard}>
            <TouchableOpacity
              style={styles.collapsedButton}
              onPress={() => { setSearchCardCollapsed(false); setResults([]); setError(''); }}
            >
              <ThemedText style={styles.buttonText}>Search Again</ThemedText>
            </TouchableOpacity>
          </View>
        )}
        {/* Results Card: only show after a search, not before */}
        {(!searching && results.length > 0) && (
          <View style={[styles.resultsCardContainer, { flex: 1 }]}> 
            <ScrollView style={styles.resultsScroll} contentContainerStyle={{ padding: 16 }}>
              {results.map((item, idx) => {
                const usd = parseFloat(item.price?.total || '0');
                const pkr = Math.round(usd * 286.47);
                return (
                  <React.Fragment key={`${item._origin}-${item._destination}-${item.id || idx}`}>
                    <View style={styles.resultCard}>
                      <ThemedText style={{
                        color: item.itineraries?.length > 1 ? '#2196f3' : '#ff9800',
                        fontWeight: 'bold',
                        fontSize: 16,
                        marginBottom: 4,
                        textAlign: 'center',
                      }}>
                        {item.itineraries?.length > 1 ? 'Round Trip' : 'One Way'}
                      </ThemedText>
                      <ThemedText type="subtitle" style={{ marginBottom: 4, color: 'green', fontWeight: 'bold' }}>
                        {usd ? `PKR ${pkr.toLocaleString()}` : 'Price N/A'}
                      </ThemedText>
                      {usd ? (
                        <ThemedText style={{ color: '#aaa', fontSize: 13, marginBottom: 4 }}>
                          (${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD)
                        </ThemedText>
                      ) : null}
                      <ThemedText style={{ color: '#7a8fa6', fontSize: 13, marginBottom: 4 }}>
                        {item._origin} → {item._destination}
                      </ThemedText>
                      {item.itineraries?.map((itin: any, itinIdx: number) => (
                        <View key={itinIdx} style={styles.legRow}>
                          <View style={{ flex: 1 }}>
                            <ThemedText style={{ fontWeight: 'bold' }}>
                              {/* Label outbound/inbound */}
                              {itinIdx === 0 ? 'Outbound' : 'Return'}: {itin.segments[0]?.departure?.iataCode} → {itin.segments[itin.segments.length-1]?.arrival?.iataCode}
                            </ThemedText>
                            <ThemedText style={{ fontSize: 13 }}>
                              {/* Format time in AM/PM */}
                              {itin.segments[0]?.departure?.iataCode} {new Date(itin.segments[0]?.departure?.at).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric', year: 'numeric' })}
                              {' '}→{' '}
                              {itin.segments[itin.segments.length-1]?.arrival?.iataCode} {new Date(itin.segments[itin.segments.length-1]?.arrival?.at).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric', year: 'numeric' })}
                            </ThemedText>
                            <ThemedText style={{ fontSize: 13 }}>
                              Segments: {itin.segments.length}
                            </ThemedText>
                            <ThemedText style={{ fontSize: 13 }}>
                              Duration: {itin.duration?.replace('PT','').toLowerCase()}
                            </ThemedText>
                          </View>
                          {/* No airline logo in Amadeus free API, but you could add static logos by carrier code if desired */}
                        </View>
                      ))}
                    </View>
                    {/* Divider after each result except the last one */}
                    {idx < results.length - 1 && (
                      <View style={styles.resultDivider} />
                    )}
                  </React.Fragment>
                );
              })}
            </ScrollView>
          </View>
        )}
        {/* Show 'No flights found.' only if a search was made and results are empty */}
        {(!searching && results.length === 0 && error) && (
          <ThemedText style={styles.error}>No flights found.</ThemedText>
        )}
      </ScrollView>
      <BottomNavBar />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 80,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    marginTop:50
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: INPUT_BG,
    fontSize: 16,
  },
  button: {
    backgroundColor: BUTTON_BG,
    borderRadius: 32,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: BUTTON_TEXT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: '#f55',
    marginTop: 10,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  legRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  airlineLogo: {
    width: 40,
    height: 40,
    marginLeft: 12,
    resizeMode: 'contain',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    maxHeight: 320,
    width: '100%',
    marginTop: 4,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  loaderLottie: {
    width: 100,
    height: 100,
  },
  resultsCardContainer: {
    flex: 1, // will fill available space in a flex parent
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    backgroundColor: CARD_BG,
    marginTop: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  resultsScroll: {
    maxHeight: 500,
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#334e68',
    marginVertical: 8,
    opacity: 0.3,
    width: '100%',
    alignSelf: 'center',
  },
  collapsedCard: {
    backgroundColor: 'rgba(20,34,54,0.97)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  collapsedCardText: {
    color: '#e6f0fa',
    fontSize: 18,
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  collapsedButton: {
    backgroundColor: BUTTON_BG,
    borderRadius: 32,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: 0,
    marginBottom: 0,
  },
});

export default Flights; 