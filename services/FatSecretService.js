const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');

class FatSecretService {
  constructor() {
    this.consumerKey = process.env.FATSECRET_CONSUMER_KEY || '3be30f279f204c47bc46639debbe4e2e';
    this.consumerSecret = process.env.FATSECRET_CONSUMER_SECRET || '9f515e5ca74b443fa4b2b625605e1b55';
    this.apiUrl = 'https://platform.fatsecret.com/rest/server.api';
  }

  // Generate OAuth signature
  generateSignature(method, url, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    const signatureBase = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    const signingKey = `${encodeURIComponent(this.consumerSecret)}&`;
    
    return crypto
      .createHmac('sha1', signingKey)
      .update(signatureBase)
      .digest('base64');
  }

  // Make API request
  async makeRequest(params) {
    const oauthParams = {
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_version: '1.0'
    };

    const allParams = { ...params, ...oauthParams };
    const signature = this.generateSignature('POST', this.apiUrl, allParams);
    allParams.oauth_signature = signature;

    const postData = querystring.stringify(allParams);

    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(this.apiUrl, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  // Search for foods
  async searchFoods(searchExpression, maxResults = 20) {
    try {
      const params = {
        method: 'foods.search',
        search_expression: searchExpression,
        max_results: maxResults,
        format: 'json'
      };

      const result = await this.makeRequest(params);
      
      if (result.foods && result.foods.food) {
        // Handle both single food and array of foods
        const foods = Array.isArray(result.foods.food) 
          ? result.foods.food 
          : [result.foods.food];
        
        return foods.map(food => ({
          id: food.food_id,
          name: food.food_name,
          description: food.food_description,
          type: food.food_type,
          url: food.food_url
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error searching foods:', error);
      throw new Error('Failed to search foods');
    }
  }

  // Get food details including servings
  async getFoodDetails(foodId) {
    try {
      const params = {
        method: 'food.get',
        food_id: foodId,
        format: 'json'
      };

      const result = await this.makeRequest(params);
      
      if (result.food) {
        const food = result.food;
        
        // Handle servings - can be single object or array
        let servings = [];
        if (food.servings && food.servings.serving) {
          servings = Array.isArray(food.servings.serving) 
            ? food.servings.serving 
            : [food.servings.serving];
        }

        return {
          id: food.food_id,
          name: food.food_name,
          type: food.food_type,
          url: food.food_url,
          servings: servings.map(serving => ({
            id: serving.serving_id,
            description: serving.serving_description,
            calories: parseFloat(serving.calories) || 0,
            carbohydrate: parseFloat(serving.carbohydrate) || 0,
            protein: parseFloat(serving.protein) || 0,
            fat: parseFloat(serving.fat) || 0,
            fiber: parseFloat(serving.fiber) || 0,
            sugar: parseFloat(serving.sugar) || 0,
            sodium: parseFloat(serving.sodium) || 0,
            metricServingAmount: serving.metric_serving_amount,
            metricServingUnit: serving.metric_serving_unit
          }))
        };
      }
      
      throw new Error('Food not found');
    } catch (error) {
      console.error('Error getting food details:', error);
      throw new Error('Failed to get food details');
    }
  }

  // Get autocomplete suggestions
  async getAutocompleteSuggestions(expression) {
    try {
      const params = {
        method: 'foods.autocomplete',
        expression: expression,
        max_results: 8,
        format: 'json'
      };

      const result = await this.makeRequest(params);
      
      if (result.suggestions && result.suggestions.suggestion) {
        const suggestions = Array.isArray(result.suggestions.suggestion) 
          ? result.suggestions.suggestion 
          : [result.suggestions.suggestion];
        
        return suggestions;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting autocomplete:', error);
      return [];
    }
  }
}

module.exports = FatSecretService;