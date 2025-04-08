/**
 * Utility functions for working with localStorage
 */

// Store data in localStorage
export const storeData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error)
    return false
  }
}

// Retrieve data from localStorage
export const retrieveData = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error)
    return defaultValue
  }
}

// Remove data from localStorage
export const removeData = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error)
    return false
  }
}

// Clear all data from localStorage
export const clearAllData = () => {
  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error("Error clearing all data:", error)
    return false
  }
}

// Update a specific item in an array stored in localStorage
export const updateArrayItem = (key, id, updatedData, idField = "id") => {
  try {
    const data = retrieveData(key, [])
    const updatedArray = data.map((item) => (item[idField] === id ? { ...item, ...updatedData } : item))
    return storeData(key, updatedArray)
  } catch (error) {
    console.error(`Error updating item in array for key ${key}:`, error)
    return false
  }
}

// Add an item to an array stored in localStorage
export const addArrayItem = (key, newItem) => {
  try {
    const data = retrieveData(key, [])
    const updatedArray = [...data, newItem]
    return storeData(key, updatedArray)
  } catch (error) {
    console.error(`Error adding item to array for key ${key}:`, error)
    return false
  }
}

// Remove an item from an array stored in localStorage
export const removeArrayItem = (key, id, idField = "id") => {
  try {
    const data = retrieveData(key, [])
    const updatedArray = data.filter((item) => item[idField] !== id)
    return storeData(key, updatedArray)
  } catch (error) {
    console.error(`Error removing item from array for key ${key}:`, error)
    return false
  }
}

