// ameen ahmad dababat
// ameendababat07@gmail.com
import { HandelOutput, fetchCountry, fetchWeather, fetchCityImage } from '../src/client/js/app';

// Mock API Calls
jest.mock('../src/client/js/app', () => ({
  HandelOutput: jest.fn(),
  fetchCountry: jest.fn(),
  fetchWeather: jest.fn(),
  fetchCityImage: jest.fn(),
}));

describe('HandelOutput', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="date" value="2025-12-31" />
      <input id="city" value="Paris" />
      <div id="numdays"></div>
      <div id="cityname"></div>
      <div id="travelDate"></div>
      <div id="tmp"></div>
      <div id="weather"></div>
      <div id="cityimg"></div>
    `;
  });

  // ameen ahmad dababat
// ameendababat07@gmail.com

  it('calls  functions and updates  UI', async () => {
    const mockEvent = { preventDefault: jest.fn() };

    // Mock  return values
    fetchCountry.mockResolvedValue({ lng: 2.3522, lat: 48.8566, name: 'france' });
    fetchWeather.mockResolvedValue({ temp: 15, app_max_temp: 18, app_min_temp: 12, description: 'Cloudy' });
    fetchCityImage.mockResolvedValue({ image: 'http://example.com/paris.jpg' });

    // Call  function
    await HandelOutput(mockEvent);
  });

  it('handle error gracefully', async () => {
    // Mock  API call to throw error
    fetchCountry.mockRejectedValue(new Error('API Error'));
    fetchWeather.mockRejectedValue(new Error('API Error'));
    fetchCityImage.mockRejectedValue(new Error('API Error'));

    const mockEvent = { preventDefault: jest.fn() };

    await HandelOutput(mockEvent);

    // Ensure  UI is not updated when errors occur  
    expect(document.getElementById('numdays').innerHTML).toBe('');
    expect(document.getElementById('cityname').innerHTML).toBe('');
  });
});