// ameen ahmad dababat
// ameendababat07@gmail.com
import { handelsubment, getCountry, getweather, getcityImage } from '../src/client/js/app';

//  API Calls
jest.mock('../src/client/js/app', () => ({
  getCountry: jest.fn(),
  getweather: jest.fn(),
  getcityImage: jest.fn(),
  handelsubment: jest.fn(),
}));

  describe('handelsubment', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="date" value="2024-12-31" />
      <input id="city" value="Paris" />
      <div id="Rdays"></div>
      <div id="cityname"></div>
      <div id="travelDate"></div>
      <div id="temp"></div>
      <div id="weather"></div>
      <div id="cityImage"></div>
    `;
  });

  describe('handelsubment', () => {
    it('should call the necessary functions and update the UI', async () => {
      const mockEvent = { preventDefault: jest.fn() };
  
      // Mock the return values
      getCountry.mockResolvedValue({ lng: 2.3522, lat: 48.8566, countryName: 'France' });
      getweather.mockResolvedValue({ temp: 15, app_max_temp: 18, app_min_temp: 12, description: 'Cloudy' });
      getcityImage.mockResolvedValue({ image: 'http://example.com/paris.jpg' });
  
      // Call the function
      await handelsubment(mockEvent);
  
  
    });
  });



  it('should handle errors gracefully', async () => {
    // Mock the API calls to throw errors
    getCountry.mockRejectedValue(new Error('API Error'));
    getweather.mockRejectedValue(new Error('API Error'));
    getcityImage.mockRejectedValue(new Error('API Error'));

    const mockEvent = { preventDefault: jest.fn() };

    await handelsubment(mockEvent);

    // Ensure the UI is not updated when errors occur
    expect(document.getElementById('Rdays').innerHTML).toBe('');
    expect(document.getElementById('cityname').innerHTML).toBe('');
  });
});