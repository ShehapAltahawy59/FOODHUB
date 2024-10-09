
# FoodHub

Welcome to **FoodHub** – an innovative online platform that allows users to explore and order food from a wide range of restaurants, all in one place. FoodHub aims to provide a seamless food-ordering experience by connecting customers with various restaurants, making it easy to browse menus, customize orders, and have food delivered to their doorstep.

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

FoodHub is a modern web application where users can:
- Browse food items from a variety of restaurants.
- Add items to the cart and place orders with just a few clicks.
- Pay for their order using a secure checkout process.
- Manage their accounts and view previous orders.
- Restaurant owners can manage their menu, track orders, and update availability.

## Key Features

- **User-Friendly Interface:** A sleek and intuitive design for both desktop and mobile.
- **Multi-Restaurant Platform:** Supports multiple restaurants with individual menus.
- **Dynamic Menus:** Restaurants can update their offerings in real-time.
- **Order Customization:** Users can customize their orders before placing them.
- **Secure Authentication:** Google-based authentication for quick and secure login.
- **Admin Panel:** Allows restaurant owners to manage their menus and view orders.

## Technologies Used

- **Frontend:**
  - HTML, CSS, JavaScript (with Bootstrap for responsiveness)
  - Icons and imagery for a clean design.
- **Backend:**
  - Python with Flask for handling requests and rendering dynamic pages.
- **Database:**
  - Firebase Firestore for real-time data management.
- **Authentication:**
  - Firebase Authentication with Google Login.
- **Deployment:**
  - Hosted on Firebase and supports easy scaling.
- **Version Control:**
  - Managed with Git.

## Prerequisites

Before you start, make sure you have the following installed:

- Python 3.8+
- Firebase CLI (for deployment)
- Git
- Node.js & npm (for managing frontend dependencies)

## Installation

To get a local copy up and running, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/foodhub.git
   cd foodhub
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows, use venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Install frontend dependencies**:
   ```bash
   npm install
   ```

## Configuration

### Firebase Configuration
1. In your project directory, create a `.env` file to store your Firebase configuration. Add the following:
   ```env
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-auth-domain
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-storage-bucket
   FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   FIREBASE_APP_ID=your-app-id
   FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

2. Ensure that your Firebase credentials file is not tracked by Git by adding it to `.gitignore`:
   ```
   firebase_config.json
   ```

### Setting Environment Variables

- On Linux/macOS, run:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/firebase_config.json"
   ```

- On Windows, run:
   ```bash
   set GOOGLE_APPLICATION_CREDENTIALS="path/to/firebase_config.json"
   ```

## Deployment

### Local Development

1. **Run the Flask app locally**:
   ```bash
   flask run
   ```
   The website will be available at `http://127.0.0.1:5000`.

2. **Using Firebase for hosting**:
   - Make sure you have Firebase CLI installed:
     ```bash
     npm install -g firebase-tools
     ```
   - Login to Firebase:
     ```bash
     firebase login
     ```
   - Initialize Firebase in your project:
     ```bash
     firebase init
     ```
     Follow the prompts to set up hosting, Firestore, and authentication.

3. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

   After deployment, your website will be live at the Firebase-provided URL.

## Usage

Once the site is deployed, users can:

- **Browse Restaurants:** View menus and choose items to order.
- **Add Items to Cart:** Users can select multiple items, customize their order, and review before checkout.
- **Authentication:** Use Google Login to sign in securely.
- **Place Orders:** Complete the order with secure payment options.
- **Restaurant Management:** Restaurant owners can log in to update their menu and view orders in real-time.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch with the feature name:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes.
4. Commit and push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
