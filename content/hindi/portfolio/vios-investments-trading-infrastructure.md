---
date: "2024-08-14"
draft: false
title: "Vios Investments – Trading Infrastructure"
logo: "images/client-logo/vios.png"
---


> Creation and deployment of an LSTM model which predicts the optimal Sharpe ratio of a given stock universe


{{< image title="Vios Investments – Trading Infrastructure" w="50%" o="webp q100" p="center" c="img-fluid shadow rounded-1" src="images/client-logo/vios.png" alt="alter-text" >}}

## Use Case: Predicting Optimal Sharpe Maximized Stock Selection for Vios Investing

**Client**: Vios Investing (Taiwan)

### Overview:

Vios Investing, a leading investment firm in Taiwan, sought to enhance their stock selection strategy by predicting the optimal Sharpe maximized selection of stocks listed on the Taiwan Stock Exchange (TWSE). By leveraging advanced statistical techniques and deep learning models, the goal was to improve their investment returns and achieve superior risk-adjusted performance.

### Objective:

To develop a predictive model using LSTM (Long Short-Term Memory) networks to forecast future stock weights that maximize the Sharpe ratio, thereby enhancing investment decisions. The solution needed to be robust, scalable, and deployable within Vios Investing’s existing infrastructure.

### Solution Design Process:

#### Requirement Analysis:

- Collaborated with Vios Investing’s financial analysts and IT team to understand their specific requirements and objectives.
- Identified key performance metrics, including the Sharpe ratio, and the constraints of the TWSE market.

#### Data Preparation:

- Collected historical stock data from the TWSE, focusing on price movements, trading volumes, and other relevant financial indicators.
- Applied statistical enhancements and denoising techniques to clean and preprocess the data, ensuring high-quality inputs for the model.

#### Model Development:

- Developed an LSTM model to predict future stock weights aimed at maximizing the Sharpe ratio.
- Implemented the model using Python and deep learning libraries, ensuring robustness and accuracy.

#### Backtesting and Validation:

- Conducted extensive backtesting using historical data to validate the model’s performance.
- Evaluated the model’s ability to achieve superior risk-adjusted returns, with a particular focus on achieving a high alpha over the TWSE index.

### Deployment:

#### Infrastructure Setup:

- Set up a Kubernetes cluster with GPU support to provide the necessary computational power for the LSTM model.
- Deployed the Docker image containing the predictive model to the Kubernetes cluster, ensuring seamless integration with Vios Investing’s existing infrastructure.

#### Model Training and Tuning:

- Trained the LSTM model on preprocessed historical data, fine-tuning hyperparameters to optimize performance.
- Incorporated feedback from initial test runs to refine the model and improve prediction accuracy.

#### Backtesting Results:

- Ran extensive backtests using demo data to simulate real-world trading scenarios.
- Achieved an alpha of 22 points per year over the TWSE index, indicating a promising enhancement in investment performance.

#### Ongoing Testing:

- Provided Vios Investing with the deployed model for further testing and validation on live data.
- Established a feedback loop to continuously monitor model performance and make necessary adjustments.

### Results and Impact:

- **Alpha Generation**: The backtesting results demonstrated an impressive alpha of 22 points per year over the TWSE index, highlighting the model’s potential to significantly enhance investment returns.
- **Sharpe Ratio Optimization**: Successfully developed a predictive model that optimizes stock weights to maximize the Sharpe ratio, providing superior risk-adjusted returns.
- **Scalable Deployment**: Deployed the model using Docker and Kubernetes, ensuring scalability, reliability, and efficient use of computational resources.
- **Real-Time Predictions**: Enabled Vios Investing to leverage real-time data for ongoing predictions, enhancing their trading strategies and decision-making process.

### Conclusion:

The project resulted in a highly effective predictive model for Vios Investing, leveraging advanced statistical techniques and deep learning to optimize stock selection on the TWSE. By achieving a significant alpha over the index, the solution promises to enhance the firm’s investment performance. The scalable deployment on Kubernetes with GPU support ensures that Vios Investing can continue to leverage cutting-edge technology for superior investment outcomes.

**Are you planning on employing machine learning to predict time series models?** Contact us now for a free consultation.