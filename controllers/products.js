const productSchema = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const products = await productSchema.find({
    
  })
  res.status(200).json({
    products,
    nbHits: products.length,
  })
}

const getAllProducts = async (req, res) => {
  const {
    featured,
    company,
    name,
    sort,
    fields,
    numericFilters,
  } = req.query
  const queryObject = {}

  // Featured
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }

  // Company
  if (company) {
    queryObject.company = company
  }

  // Name
  if (name) {
    queryObject.name = {$regex: name, $options: 'i'}
  }

  // Numeric Filters
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      '=': '$eq',
    }
    const regex = /\b(>|>=|=|<|<=)\b/g
    let filters = numericFilters.replace(regex,(march) => `-${operatorMap[match]}-`)
    const options = ['price', 'rating']
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-')

      if(options.includes(field)) {
        queryObject[field] = {
          [operator]: value
        }
      }
    })
  }

  let result = productSchema.find(queryObject)

  // Sort
  if (sort) {
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('createdAt')
  }

  // Fields
  if (fields) {
    const fieldList = fields.split(',').join(' ')
    result = result.select(fieldList)
  } 

  // Limit, Page adn Skip
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page -1) * limit

  result = result.skip(skip).limit(limit)

  const products = await result

  res.status(200).json({
    products,
    nbHits: products.length,
  })
}

module.exports = {
  getAllProductsStatic,
  getAllProducts
}
