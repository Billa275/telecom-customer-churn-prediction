# Telecom Customer Churn Prediction Using Machine Learning

## 1. Project Overview

Customer churn is a major challenge in the telecommunications industry. It refers to customers discontinuing the services provided by a telecom company.

This project develops a web-based Customer Churn Prediction System using Machine Learning and Reinforcement Learning concepts. It analyzes customer information and predicts the likelihood of a customer leaving the service provider.

The system uses an **XGBoost classification model** to predict customer churn and a **Q-Learning-based recommendation mechanism** to suggest suitable customer retention strategies based on the predicted risk level.

The application integrates a Python Flask backend with a frontend interface to provide customer predictions and retention recommendations.

## 2. Project Objectives

- Predict customer churn using Machine Learning.
- Analyze customer details and identify potential churn factors.
- Categorize customers based on their churn risk.
- Recommend suitable customer retention strategies.
- Provide an interactive interface for generating predictions.
- Help telecom companies make data-driven retention decisions.

## 3. Technologies Used

### Backend
- Python
- Flask
- Flask-CORS

### Machine Learning and Data Processing
- XGBoost
- Scikit-learn
- Pandas
- NumPy

### Frontend
- React
- JavaScript
- Vite
- Tailwind CSS

### Development Tools
- Visual Studio Code
- Git
- GitHub

## 4. Project Structure

```text
CUSTOMER-CHURN-PREDICTION/
│
├── backend/
│   ├── app.py
│   ├── api.js
│   ├── requirements.txt
│   └── Balanced_Telco_Customer_Churn.csv
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── App
│   ├── package.json
│   ├── package-lock.json
│   ├── index
│   └── configuration files
│
├── .gitignore
├── .gitattributes
├── LICENSE
└── README.md
```

## 5. System Workflow

1. **Data Loading:** The telecom customer churn dataset is loaded into the backend.
2. **Data Preprocessing:** Customer IDs are removed, missing values are handled, and the TotalCharges column is converted into numeric format.
3. **Feature Encoding:** Categorical customer attributes are converted into numerical values using Label Encoding.
4. **Feature Scaling:** StandardScaler is applied to normalize the input features.
5. **Model Training:** The dataset is divided into training and testing sets, and an XGBoost classifier is trained.
6. **Churn Prediction:** The trained model calculates the probability of customer churn.
7. **Risk Classification:** Customers are classified into Low Risk, Medium Risk, and High Risk categories.
8. **Retention Recommendation:** A Q-Learning-based Q-table selects a recommended retention action according to the customer's risk category.
9. **Result Display:** The prediction, churn probability, risk level, and recommended strategy are returned through the Flask API for frontend integration.

## 6. Key Features

- Machine Learning-based customer churn prediction.
- XGBoost classification algorithm.
- Customer churn probability calculation.
- Three-level customer risk classification.
- Q-Learning-based retention strategy selection.
- Flask REST API integration.
- Separate frontend and backend architecture.

## 7. Machine Learning Model

The project uses the XGBoost Classifier to predict customer churn.

The model is trained using customer information after preprocessing, categorical encoding, and feature scaling.

The output includes:

- **Churn Prediction:** Yes or No.
- **Churn Probability:** Estimated probability of customer churn.
- **Risk Level:** Low Risk, Medium Risk, or High Risk.

## 8. Retention Strategy Recommendation

A Q-Learning-based table is implemented to select retention strategies based on customer risk levels.

The system considers three customer states:

- Low Risk
- Medium Risk
- High Risk

It considers three possible actions:

- Do Nothing
- Offer Discount
- Call Customer

Based on the learned Q-values, the system selects the action with the highest value for the predicted risk category.

## 9. Installation and Setup

### Prerequisites

- Python 3.9 or later
- Node.js and npm
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/telecom-customer-churn-prediction.git
```

### Step 2: Navigate to the Project

```bash
cd telecom-customer-churn-prediction
```

### Step 3: Setup Backend

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask backend:

```bash
python app.py
```

The backend runs at:

`http://localhost:5000`

### Step 4: Setup Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal to access the application.

## 10. Dataset

The project uses the Telecom Customer Churn dataset:

**Dataset:** Balanced_Telco_Customer_Churn.csv

It contains customer-related information used for training the Machine Learning model and generating churn predictions.

## 11. Future Enhancements

- Improve prediction accuracy through additional model evaluation and tuning.
- Develop more personalized customer retention recommendations.
- Add interactive visualizations and customer analytics.
- Deploy the application on a cloud platform.
- Enhance the model with additional customer behavior data.

## 12. Author

**Your Name**

B.Tech – Artificial Intelligence and Data Science

## 13. License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.
