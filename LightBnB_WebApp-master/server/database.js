const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

const properties = require('./json/properties.json');
const users = require('./json/users.json');


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`SELECT * FROM users WHERE email = $1`, [email])
  .then((result) => {
    if (result.rows) {
      return result.rows[0];
    } else {
      return null;
    }
  }).catch((err) => {
    console.log('query error', err);
  });
}
exports.getUserWithEmail = getUserWithEmail;


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `SELECT * FROM users WHERE users.id = $1`;

  return pool.query(queryString, [id])
  .then((result) => {
    if (result.rows) {
      return result.rows[0];
    } else {
      return null;
    }
  }).catch((err) => {
    console.log('query error', err);
  });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryString = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`;

  return pool.query(queryString, [user.name, user.email, user.password])
  .then((result) => {
    if (result.rows) {
      return result.rows[0];
    } else {
      return null;
    }
  }).catch((err) => {
    console.log('query error', err);
  });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `;

  return pool.query(queryString, [guest_id, limit])
  .then((result) => {
    return result.rows;
  }).catch((err) => {
    console.log('query error', err);
  });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
   // 1 Setup an array to hold any parameters that may be available for the query.
   const queryParams = [];
   // 2 Start the query with all information that comes before the WHERE clause.
   let queryString = `
   SELECT properties.*, avg(property_reviews.rating) as average_rating
   FROM properties
   JOIN property_reviews ON properties.id = property_id
   `;
 
   // 3 Check if a city has been passed in as an option. Add the city to the params array and create a WHERE clause for the city.
   if (options.city) {
     queryParams.push(`%${options.city}%`);
     queryString += `WHERE city LIKE $${queryParams.length} `;
   }

   // 3.1 Check if the owner_id has been passed in as an option. Add to the params array and create a WHERE clause for the owner_id.
    if (options.owner_id) {
      queryParams.push(options.owner_id);
      if (queryParams.length === 1) {
        queryString += `WHERE owner_id = $${queryParams.length}`;
      } else {
        queryString += `AND owner_id = $${queryParams.length}`;
      }
    }

    // 3.2 Check if the minimum_price_per_night and a maximum_price_per_night has been passed in as an option. Only return properties within that price range. (HINT: The database stores amounts in cents, not dollars!)Add to the params array and create a WHERE clause for the minimum_price_per_night.
    if (options.minimum_price_per_night && options.maximum_price_per_night) {
      queryParams.push(options.minimum_price_per_night * 100, options.maximum_price_per_night * 100);
      if (queryParams.length === 2) {
      queryString += `WHERE cost_per_night >= $${queryParams.length -1} AND cost_per_night <= $${queryParams.length}`;
      } else {
      queryString += `AND cost_per_night >= $${queryParams.length -1} AND cost_per_night <= $${queryParams.length}`;
      }
    }
    
    // 3.3 After WHERE clauses have been added, add a GROUP BY clause to group the results by properties.id. 
    queryString += `
    GROUP BY properties.id
    `;

    //3.4 Add a HAVING clause that only returns properties with a count of reviews that is greater than 0.

    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
    }

 
   // 4 Add any query that comes after the WHERE clause.
   queryParams.push(limit);
   queryString += `
   ORDER BY cost_per_night
   LIMIT $${queryParams.length};
   `;
 
   // 5 Console log everything just to make sure we've done it right.

   console.log(queryString, queryParams);
 
   // 6 Run the query.
   return pool.query(queryString, queryParams).then((res) => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `;
  const queryParams = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];

  return pool.query(queryString, queryParams)
  .then((result) => {
    return result.rows[0];
  }).catch((err) => {
    return console.log('query error', err);
  });
}
exports.addProperty = addProperty;
