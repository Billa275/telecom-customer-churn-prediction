export const predictChurn = async (customerData) => {
  try {
    const response = await fetch('http://localhost:5000/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};