# Predictive Cleaning Schedule Application

## Overview
This Python application uses machine learning to predict the optimal cleaning schedule based on historical data. It forecasts the next cleaning date, location within a residence, and the suitable time of day for cleaning.

## Description
The application is designed to optimize household cleaning schedules using machine learning. It generates synthetic data to mimic real-world cleaning activities, which includes details like cleaning dates, locations, and times. Custom functions parse this data, determining cost-effective cleaning times and categorizing cleaning sessions. Feature engineering is employed to extract useful features such as the day of the week and intervals until the next cleaning. The application then uses RandomForest models to predict the optimal date, location, and time for future cleaning activities, providing users with an efficient and organized cleaning schedule.

## Features
- **Data Generation and Parsing**: Generates synthetic data representing cleaning schedules, including date, location, and time of day.
- **Custom Functions**: Implements functions to parse input strings, determine cheap electricity times, and categorize hours into day parts.
- **Data Preparation and Feature Engineering**: Organizes the data, performing feature engineering to prepare it for machine learning models.
- **Predictive Modeling**: Uses Random Forest models to predict the next cleaning date, location, and hour range.

## Usage
1. **Data Generation**: Create synthetic data for various cleaning scenarios.
2. **Data Parsing**: Parse the generated data into a structured format.
3. **Sorting and Index Resetting**: Sort data by date and reset indices for efficient processing.
4. **Feature Engineering**: Calculate additional features like day of the week and interval until next cleaning.
5. **Model Training**: Train separate models for predicting the date, location, and hour range.
6. **Prediction**: Use current date and time to predict the next cleaning schedule.

## Requirements
- pandas
- numpy
- datetime
- scikit-learn
