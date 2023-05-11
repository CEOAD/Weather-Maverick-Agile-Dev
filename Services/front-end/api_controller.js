/**
 * Houses the logic for making API calls and parsing the responses.
 */
class ApiController {

    /**
     * Fetches the AQI for the given latitude and longitude.
     * @param lat                   The latitude.
     * @param lng                   The longitude.
     * @return {Promise<*|null>}    The AQI or null if an error occurred.
     */
    static async getAQI(lat, lng) {
        try {
            const response = await axios.get("http://api.airvisual.com/v2/nearest_city", {
                params: {
                    lat: lat,
                    lon: lng,
                    key: "f5827a18-9aee-4c49-a4f7-7aaa4ee1d336",
                },
            });
            return response.data?.data?.current?.pollution?.aqius ?? null;
        } catch (error) {
            console.error('Error fetching AQI data:', error);
        }
    }

    /**
     * Fetches the weather for the given latitude and longitude.
     * @param lat               The latitude.
     * @param lng               The longitude.
     * @return {Promise<*>}     The weather data.
     */
    static async getWeather(lat, lng) {
        try {
            const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
                params: {
                    lat: lat,
                    lon: lng,
                    appid: "3f171dd2f33fcfa66e7d8971457c3922",
                    units: "metric",
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching Weather data:', error);
        }
    }

    /**
     * Fetches the nearby cities for the given latitude and longitude.
     * @param lat                   The latitude.
     * @param lng                   The longitude.
     * @param map                   The map.
     * @return {Promise<*[]>}     The nearby cities.
     */
    static async getNearbyCities(lat, lng, map) {
        const location = new google.maps.LatLng(lat, lng);
        const service = new google.maps.places.PlacesService(map);

        const request = {
            location: location,
            radius: 100000, // Search within a radius of 100 km
            query: "city",
        };

        try {
            const results = await new Promise((resolve, reject) => {
                service.textSearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve(results);
                    } else {
                        reject(`Error fetching nearby cities: ${status}`);
                    }
                });
            });

            return results.slice(-3).map(result => ({
                name: result.name,
                latitude: result.geometry.location.lat(),
                longitude: result.geometry.location.lng(),
            }));
        } catch (error) {
            console.error(`Error fetching nearby cities: ${error}`);
            return [];
        }
    }

    /**
     * Fetches the nearby cities for the given latitude and longitude.
     * @param iconCode           The icon code.
     * @return {string}
     */
    static getWeatherIconURL(iconCode) {
        return `http://openweathermap.org/img/w/${iconCode}.png`;
    }

}

// export default ApiController;
module.exports = ApiController;