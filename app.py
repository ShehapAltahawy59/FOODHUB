import json
from math import ceil
import random
from flask import Flask, request, render_template, redirect, url_for, flash,jsonify,session,send_from_directory
import firebase_admin
from flask_login import LoginManager, login_user,login_required, logout_user, current_user
from firebase_admin import credentials, firestore, storage,auth
from users.user import User
import os
from datetime import datetime, timedelta
from functools import wraps
# Initialize Flask app
app = Flask(__name__)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.login_message_category = 'info'
login_manager.init_app(app)

app.secret_key = '73ac6ddcd6a88955e0f720b20b459f93'
url_for_cloud_path = "categories/categories"
# Initialize Firebase
try:
    cred = credentials.Certificate('firebase_config.json')
except:
    firebase_config = {
    "type": os.getenv("type"),
    "project_id": os.getenv("project_id"),
    "private_key_id": os.getenv("private_key_id"),
    "private_key": os.getenv("private_key").replace('\\n', '\n'),  # Ensure new lines are correct
    "client_email": os.getenv("client_email"),
    "client_id": os.getenv("client_id"),
    "auth_uri": os.getenv("auth_uri"),
    "token_uri": os.getenv("token_uri"),
    "auth_provider_x509_cert_url": os.getenv("auth_provider_x509_cert_url"),
    "client_x509_cert_url": os.getenv("client_x509_cert_url"),
    "universe_domain": os.getenv("universe_domain"),
    }
    cred = credentials.Certificate(firebase_config)

try:
        with open('firebase_config_js.json') as config_file:
            firebase_config = json.load(config_file)
    
except:
    firebase_config = {
    "apiKey": os.environ.get("FIREBASE_API_KEY"),
    "authDomain": os.environ.get("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.environ.get("FIREBASE_PROJECT_ID"),
    "storageBucket": os.environ.get("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.environ.get("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.environ.get("FIREBASE_APP_ID"),
    "measurementId": os.environ.get("FIREBASE_MEASUREMENT_ID")
    }   


firebase_admin.initialize_app(cred, {
    'storageBucket': 'foodorderapp-2b2df.appspot.com'
})
db = firestore.client()
bucket = storage.bucket()



@app.route('/')
def home():
    categories_ref = db.collection('categories')
    categories = [doc.to_dict() for doc in categories_ref.stream()]
    categories = [category for category in categories if category["Type"]==1]

    constants_ref = db.collection('constants')
    constants = [doc.to_dict() for doc in constants_ref.stream()]
    _constants=constants[0]["Types"]
    
    types = [constant  for constant in _constants if (constant["syana"]==0)]
    for type in types:
        type["resturants"]=[category for category in categories if type["id"] in category["list_types"]]
    
    return render_template('E_commerc.html',categories=categories,types=types,current_user=current_user)



@app.route('/categories/<category_id>')
def get_categories_basedontype(category_id):
    items_ref = db.collection('items')
    items = [doc.to_dict() for doc in items_ref.stream()]
    _items= [item for item in items if category_id == item["item_cat"]   ]
    categories_ref = db.collection('categories')
    categories = [doc.to_dict() for doc in categories_ref.stream()]
    category =next((category for category in categories if category["id"] == category_id), None)
    

    types=category["subcat"]["en"]
    types_names= [{index: name} for index, name in enumerate(types)]
    print(types_names)
    print(_items)
    return render_template('E_commerc_categories_page.html',items=_items,category=category,types=types_names)



@login_manager.user_loader
def load_user(user_id):
    # Retrieve user from Firestore using their UID (which is stored as user_id)
    users_ref = db.collection('users')
    query = users_ref.where('user_id', '==', user_id).limit(1).get()
    
    
    if len(query) > 0:
        user_doc = query[0]
        user_data = user_doc.to_dict()
        
        return User(user_id, user_data['email'], user_data['username'],user_data['profile_img'],user_data['phone'],user_data['addresses'],user_data["is_admin"],user_data["is_sub_admin"])
    return None

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        print("here")
        data = request.get_json()
        email = data.get('email')
        name = data.get('name')
        phone = data.get('phone')
        img = data.get('photoURL')
        uid = data.get('uid')
        
        # Query Firestore to check if user with the email exists
        users_ref = db.collection('users')
        query = users_ref.where('user_id', '==', uid).limit(1).get()

        # Check if any documents are returned
        if len(query) == 0:
            # User does not exist, add them to Firestore
            new_user_ref = users_ref.document()  # Auto-generate document ID
            new_user_ref.set({
                'email': email,
                'username': name,
                'phone': [phone],
                'profile_img': img,
                'user_id': uid,
                'addresses': [],
                'is_admin': False,
                'is_sub_admin':False,
            })
        

        # Log the user in using Flask-Login
        
        
        user_obj = User(uid, email, name,img,phone,[],False,False)
        login_user(user_obj)

        # Redirect to a different page after successful login
        return jsonify({'redirect_url': url_for('home')}), 200
    if current_user.is_authenticated and (current_user.is_admin or current_user.is_sub_admin):
        return redirect(url_for('Admin_Dashboard'))
    else:
        return render_template('E_commerc_login_page.html')



def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            flash('You do not have permission to access this page.', 'error')
            return redirect(url_for('home'))  # Redirect to a different page
        return f(*args, **kwargs)
    return decorated_function

def admin_or_sub_admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not (current_user.is_authenticated and (current_user.is_admin or current_user.is_sub_admin)):
            flash("You do not have permission to access this page.", "danger")
            return redirect(url_for('home'))  # Redirect to login or an unauthorized page
        return f(*args, **kwargs)
    return decorated_function

@app.route('/logout', methods=['POST'])
def logout():
    logout_user()  # Logs out the user from Flask-Login
    return '', 204  # Return a 204 No Content status    


@app.route('/orders')
@login_required
def orders():
    return render_template('E_orders_page.html')

@app.route('/cart')
@login_required
def cart():
    return render_template('E_cart_page.html',current_user=current_user)

@app.route('/profile')
@login_required
def profile():
    return render_template('E_profile_page.html',current_user=current_user)


@app.route('/check-email', methods=['POST'])
def check_email():
    email = request.json.get('email')
    try:
        user = auth.get_user_by_email(email)
        if user.email_verified:
            return jsonify({"message": "Email is verified!"})
        else:
            return jsonify({"message": "Email is not verified!"}), 400
    except firebase_admin.auth.UserNotFoundError:
        return jsonify({"message": "User not found"}), 404

@app.route('/check-email-exists', methods=['POST'])
def check_email_exists():
    email = request.json.get('email')
    try:
        user = auth.get_user_by_email(email)  # Check if user exists
        return jsonify({"exists": True, "message": "Email exists!"}), 200
    except firebase_admin.auth.UserNotFoundError:
        return jsonify({"exists": False, "message": "Email does not exist."}), 404
######################################


@app.route('/Admin_Dashboard')
@admin_or_sub_admin_required
def Admin_Dashboard():
    session.pop('item_cat', None)
    session.pop('item_cat_sub', None)
    return render_template('Admin_DASHBOARD.html',current_user=current_user)

@app.route('/Admin_Dashboard/restaurants',methods=['GET', 'POST'])
@admin_required
def Admin_Dashboard_restaurants():
    if request.method == 'POST':
        restaurant_name = request.form['name_en']
        
        # Handle single image upload for category image
        cat_image_file = request.files['cat_image']
        cat_image_blob = bucket.blob(f"{url_for_cloud_path}/{restaurant_name}/{cat_image_file.filename}")
        cat_image_blob.upload_from_file(cat_image_file)
        cat_image_blob.make_public()
        cat_image_url = cat_image_blob.public_url

        # Handle multiple image uploads for menus
        menu_files = request.files.getlist('menus')
        menu_urls = []
        for menu_file in menu_files:
            menu_blob = bucket.blob(f"{url_for_cloud_path}/{restaurant_name}/menus/{menu_file.filename}")
            menu_blob.upload_from_file(menu_file)
            menu_blob.make_public()
            menu_urls.append(menu_blob.public_url)
        
        rate_count = f"{random.randint(10, 99)}"

        new_resturant = {
            "OpenTime": {
                "From": request.form['open_from'],
                "To": request.form['open_to']
            },
            "discount":"0",
            "Type": int(request.form['type']),
            "active": request.form['active'] == 'true',
            "closefriday": request.form['closefriday'] == 'true',
            "allhour": request.form['allhour'] == 'true',
            "cat_image": cat_image_url,
            "data": {
                "address": request.form['address'],
                "location": request.form['location'],
                "menus": menu_urls,
                "phone": request.form['phone'],
            },
            "delivery": [{
                "name": request.form['delivery_name'],
                "phone": request.form['delivery_phone']
            }],
            "list_types": request.form.getlist('list_types'),
            "name_ar": request.form['name_ar'],
            "name_en": restaurant_name,
            "order": request.form['order'] == 'true',
            "password": request.form['password'],
            "patener": request.form['patener'] == 'true',
            "where":request.form['where'],
            "pop": request.form['pop'],
            "rate": request.form['rate'],
            "rate_count":rate_count,
            "sorter": int(request.form['sorter']),
            "subcat": {
                "ar": request.form['subcat_ar'].split(','),
                "en": request.form['subcat_en'].split(','),
            },
            "user_name": request.form['user_name'],
        }

        doc_ref = db.collection('categories').add(new_resturant)[1]
        doc_id = doc_ref.id
        doc_ref.update({"id": doc_id})
        flash('Restaurant added successfully!', 'success')
        return  redirect(url_for('Admin_Dashboard_restaurants'))
    types_ref = db.collection('constants').get()[0].to_dict()["Types"]
    item_cat = session.get('item_cat', '')
    item_cat_sub = session.get('item_cat_sub', '')
    categories_ref = db.collection('categories')
    categories = [doc.to_dict() for doc in categories_ref.get()]
    return render_template('Admin_DASHBOARD_resturant.html',categories=categories, types=types_ref,item_cat=item_cat, item_cat_sub=item_cat_sub)


@admin_required
@app.route('/get_categories', methods=['GET'])
def get_categories():
    # Get the pagination parameters from the request
    rows_per_page = int(request.args.get('rows_per_page', 10))  # Default to 10 rows
    current_page = int(request.args.get('current_page', 1))  # Default to the first page

    # Fetch categories from your database (replace this with actual database query)
    categories = db.collection('categories').get()  # Replace with your database call
    total_categories = len(categories)  # Get the total number of categories

    # Calculate the start and end index based on current page and rows per page
    start_index = (current_page - 1) * rows_per_page
    end_index = start_index + rows_per_page
    paginated_categories = categories[start_index:end_index]

    # Calculate total number of pages
    total_pages = ceil(total_categories / rows_per_page)
    print(total_pages)

    # Return the paginated data along with pagination info
    return jsonify({
        'categories': [category.to_dict() for category in paginated_categories],
        'current_page': current_page,
        'total_pages': total_pages,
        'total_categories': total_categories,
    })

@admin_required
@app.route('/search_in_categories')
def search_in_categories():
    search_query = request.args.get('search', '').lower()
    rows_per_page = int(request.args.get('rows_per_page', 10))
    current_page = int(request.args.get('current_page', 1))
    categories = db.collection('categories').get()
    categories=[cat.to_dict() for cat in categories]
    # Filter categories by search_query
    filtered_categories = [cat for cat in categories if search_query in cat['name_en'].lower()]

    # Apply pagination (if needed)
    total_categories = len(filtered_categories)
    start = (current_page - 1) * rows_per_page
    end = start + rows_per_page
    paginated_categories = filtered_categories[start:end]

    return jsonify({
        'categories': paginated_categories,
        'total_categories': total_categories,
        'total_pages': ceil(total_categories / rows_per_page)
    })



################################################################3
admin_or_sub_admin_required
@app.route('/Admin_Dashboard/riders')
def Admin_Dashboard_riders():
    categories_ref = db.collection('constants')
    categories = [doc.to_dict() for doc in categories_ref.get()]
    riders = [category for category in categories ]
    return render_template('Admin_DASHBOARD_riders.html',current_user=current_user,riders=riders[0]['delivery_men'])

admin_or_sub_admin_required
@app.route('/add_delivery_men', methods=['GET', 'POST'])
def add_delivery_men():
    if request.method == 'POST':
        users_ref = db.collection('constants')
        docs = users_ref.get()
        user_docs = [doc for doc in docs]
        delivery_men = user_docs[0].to_dict()["delivery_men"]
        delivery_men_1 = {
            "active": True,
            "name": request.form['name'],
            "password": request.form['password'],
            "phone": request.form['phone'],
            "unpaid": "0",
        }
        delivery_men.append(delivery_men_1)
        user_docs[0].reference.update({"delivery_men": delivery_men})
        flash('Delivery man added successfully!', 'success')
        return redirect(url_for('add_delivery_men'))
    return render_template('Admin_DASHBOARD_riders.html')


admin_or_sub_admin_required
@app.route('/get_riders', methods=['GET'])
def get_riders():
    # Get the pagination parameters from the request
    rows_per_page = int(request.args.get('rows_per_page', 10))  # Default to 10 rows
    current_page = int(request.args.get('current_page', 1))  # Default to the first page

    # Fetch categories from your database (replace this with actual database query)
    riders_ref = db.collection('constants')
    riders = [doc.to_dict() for doc in riders_ref.get()]
    riders = [ride for ride in riders ]
    riders = riders[0]['delivery_men']  # Replace with your database call
    total_riders = len(riders)  # Get the total number of categories

    # Calculate the start and end index based on current page and rows per page
    start_index = (current_page - 1) * rows_per_page
    end_index = start_index + rows_per_page
    paginated_riders = riders[start_index:end_index]

    # Calculate total number of pages
    total_pages = ceil(total_riders / rows_per_page)
    print(total_pages)

    # Return the paginated data along with pagination info
    return jsonify({
        'riders': paginated_riders,
        'current_page': current_page,
        'total_pages': total_pages,
        'total_riders': total_riders,
    })


@admin_or_sub_admin_required
@app.route('/search_in_riders')
def search_in_riders():
    search_query = request.args.get('search', '').lower()
    rows_per_page = int(request.args.get('rows_per_page', 10))
    current_page = int(request.args.get('current_page', 1))
    riders_ref = db.collection('constants')
    riders = [doc.to_dict() for doc in riders_ref.get()]
    riders = [ride for ride in riders ]
    riders = riders[0]['delivery_men']
    # Filter categories by search_query
    filtered_riders = [ride for ride in riders if search_query in ride['name'].lower()]

    # Apply pagination (if needed)
    total_riders = len(filtered_riders)
    start = (current_page - 1) * rows_per_page
    end = start + rows_per_page
    paginated_riders = filtered_riders[start:end]
    print(paginated_riders[0])
    return jsonify({
        'riders': paginated_riders,
        'total_riders': total_riders,
        'total_pages': ceil(total_riders / rows_per_page)
    })






################################################3
@admin_required
@app.route('/Admin_Dashboard/resturant/items')
def Resturant_items():
    categories_ref = db.collection('categories')
    categories = [doc.to_dict() for doc in categories_ref.get()]
    items_ref = db.collection('items')
    items = [doc.to_dict() for doc in items_ref.get()]
    return render_template('ADMIN_dashboard_resturant_items.html',categories=categories,items=items)

@admin_required
@app.route('/get_subcategories/<category_id>')
def get_subcategories(category_id):
    category_doc = db.collection('categories').document(category_id).get()
    if category_doc.exists:
        subcategories = category_doc.to_dict().get('subcat', [])
        subcategories= subcategories['ar']
        return jsonify({'subcategories': [{'id': idx, 'name_ar': subcat} for idx, subcat in enumerate(subcategories)]})
    else:
        return jsonify({'subcategories': []})


@admin_required
@app.route('/add_item', methods=['POST'])
def add_item():
    

    if request.method == 'POST':
        discount = parse_discount(request.form['discount'])
        
        if request.form['name_en'] == "":
            name_en=request.form['name_ar']
        else:
            name_en=request.form['name_en']

        name= request.form.getlist('extras_name'),
        
        name_ar= request.form.getlist('extras_name_ar'),
        price= request.form.getlist('extras_price'),
        if (name==([''],) or name_ar==([''],) or price==([''],)  ):
            
            extras={
                "name":[],
                "name_ar": [],
                "price": [],
            }
            
        else:
            extras={
                "name": request.form['extras_name'].split(","),
                "name_ar": request.form['extras_name_ar'].split(","),
                "price": request.form['extras_price'].split(",")   
            }

        name_= request.form.getlist('sizes_name'),
        name_ar_= request.form.getlist('sizes_name_ar'),
        price_= request.form.getlist('sizes_price'),

        restaurant_name=request.form["item_cat"]
        discount_res = parse_discount(db.collection('categories').document(restaurant_name).get().to_dict()["discount"])
        discountratio:float=(1-discount_res/100)
        if (name_==([''],) or name_ar_==([''],) or price_==([''],) ):
            sizes={}
        else:
            sizes={
                "name": request.form['sizes_name'].split(","),
                "name_ar": request.form['sizes_name_ar'].split(","),
                "price": [str((int(x)-int(request.form['price']))*discountratio) for x in request.form['sizes_price'].split(",")],
                "pricebeforediscount":[str(int(x)-int(request.form['price'])) for x in request.form['sizes_price'].split(",")]
            }
        item_image_urls=[]
        if request.form['item_image'].split(",") == ['']:
            restaurant_name=request.form["item_cat"]
            image=db.collection('categories').document(restaurant_name).get().to_dict()["cat_image"]
            item_image_urls.append(image)
        else:
            item_image_urls=request.form['item_image'].split(",")

        new_item = {
            "active": True,
            "discount": str(discount),
            "extras": extras,
            "item_cat_sub": int(request.form['item_cat_sub']),
            "item_cat": request.form['item_cat'],
            "item_desc": request.form['item_desc'],
            "item_desc_en": request.form['item_desc_en'],
            "item_image": item_image_urls,
            "name_en": name_en,
            "name_ar": request.form['name_ar'],
            "price": request.form['price'],
            "priceafterdiscount": str((int(request.form['price']) - discount)*discountratio),
            "sizes": sizes,
        }

        #Add the document to Firestore and get the reference
        doc_ref = db.collection('items').add(new_item)[1]
        doc_id = doc_ref.id
        doc_ref.update({"item_id": doc_id})

        flash('Item added successfully!', 'success')
        
        return redirect(url_for('Resturant_items'))

@admin_required
@app.route('/get_items', methods=['GET'])
def get_items():
    # Get the pagination parameters from the request
    rows_per_page = int(request.args.get('rows_per_page', 10))  # Default to 10 rows
    current_page = int(request.args.get('current_page', 1))  # Default to the first page

    # Fetch categories from your database (replace this with actual database query)
    items = db.collection('items').get()  # Replace with your database call
    total_items = len(items)  # Get the total number of categories

    # Calculate the start and end index based on current page and rows per page
    start_index = (current_page - 1) * rows_per_page
    end_index = start_index + rows_per_page
    paginated_items = items[start_index:end_index]

    # Calculate total number of pages
    total_pages = ceil(total_items / rows_per_page)
    print(total_pages)

    # Return the paginated data along with pagination info
    return jsonify({
        'items': [item.to_dict() for item in paginated_items],
        'current_page': current_page,
        'total_pages': total_pages,
        'total_items': total_items,
    })

@admin_required
@app.route('/search_in_items')
def search_in_items():
    search_query = request.args.get('search', '').lower()
    rows_per_page = int(request.args.get('rows_per_page', 10))
    current_page = int(request.args.get('current_page', 1))
    items = db.collection('items').get()
    items=[cat.to_dict() for cat in items]
    # Filter categories by search_query
    filtered_items = [cat for cat in items if search_query in cat['name_en'].lower()]

    # Apply pagination (if needed)
    total_items = len(filtered_items)
    start = (current_page - 1) * rows_per_page
    end = start + rows_per_page
    paginated_items = filtered_items[start:end]

    return jsonify({
        'items': paginated_items,
        'total_items': total_items,
        'total_pages': ceil(total_items / rows_per_page)
    })

def parse_discount(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return 0


#######################
@admin_required
@app.route('/Admin_Dashboard/Orders')
def Admin_Dashboard_Orders():
    Orders_ref = db.collection('orders')
    Orders = [doc.to_dict() for doc in Orders_ref.get()]
    
    return render_template('ADMIN_dashboard_orders.html',Orders=Orders)

######################################
@admin_required
@app.route('/Admin_Dashboard/Coupons')
def Admin_Dashboard_Coupons():
    Coupons_ref = db.collection('Coupons')
    Coupons = [doc.to_dict() for doc in Coupons_ref.get()]
    
    return render_template('ADMIN_dashboard_Coupons.html',Coupons=Coupons)

@admin_required
@app.route('/Admin_Dashboard/add_Coupons', methods=['POST'])
def add_Coupons():
    if request.method == 'POST':
        
        # Handle multiple image uploads for menus
        if (request.form['Based_on_Date'] == 'true'):
            current_time = datetime.now()
            end_date = current_time + timedelta(int(request.form['Number_of_Dates']))
        else:
            end_date=None

        new_Coupon = {
            "discount":int(request.form['Discount']),
            "baesd_on_count": request.form['Based_on_Count'] == 'true',
            "based_on_date": request.form['Based_on_Date'] == 'true',
            "code": request.form['code'],
            "users":[],
            "restaurants":[],
            "end_date":end_date,
            "count":int(request.form['Count']),
            "offer_in_total": request.form['offer_in_total'] == 'true',
            "for_all_res":request.form['for_all_res'] == 'true',
        }

        doc_ref = db.collection('Coupons').add(new_Coupon)[1]
        doc_id = doc_ref.id
        doc_ref.update({"id": doc_id})
        flash('Restaurant added successfully!', 'success')
        return  redirect(url_for('Admin_Dashboard_restaurants'))


@admin_required
@app.route('/get_Coupons', methods=['GET'])
def get_Coupons():
    # Get the pagination parameters from the request
    rows_per_page = int(request.args.get('rows_per_page', 10))  # Default to 10 rows
    current_page = int(request.args.get('current_page', 1))  # Default to the first page

    # Fetch categories from your database (replace this with actual database query)
    Coupons = db.collection('Coupons').get()  # Replace with your database call
    total_Coupons = len(Coupons)  # Get the total number of categories

    # Calculate the start and end index based on current page and rows per page
    start_index = (current_page - 1) * rows_per_page
    end_index = start_index + rows_per_page
    paginated_Coupons = Coupons[start_index:end_index]

    # Calculate total number of pages
    total_pages = ceil(total_Coupons / rows_per_page)
    print(total_pages)

    # Return the paginated data along with pagination info
    return jsonify({
        'Coupons': [category.to_dict() for category in paginated_Coupons],
        'current_page': current_page,
        'total_pages': total_pages,
        'total_Coupons': total_Coupons,
    })


@admin_required
@app.route('/search_in_Coupons')
def search_in_Coupons():
    search_query = request.args.get('search', '').lower()
    rows_per_page = int(request.args.get('rows_per_page', 10))
    current_page = int(request.args.get('current_page', 1))
    Coupons_ref = db.collection('Coupons')
    Coupons = [doc.to_dict() for doc in Coupons_ref.get()]
    
    # Filter categories by search_query
    filtered_Coupons = [ride for ride in Coupons if search_query in ride['code'].lower()]

    # Apply pagination (if needed)
    total_Coupons = len(filtered_Coupons)
    start = (current_page - 1) * rows_per_page
    end = start + rows_per_page
    paginated_Coupons = filtered_Coupons[start:end]

    return jsonify({
        'Coupons': paginated_Coupons,
        'total_categories': total_Coupons,
        'total_pages': ceil(total_Coupons / rows_per_page)
    })




##################################
admin_or_sub_admin_required
@app.route('/Admin_Dashboard/Delivary_Rates')
def Admin_Dashboard_Delivary_Rates():
    return render_template('ADMIN_dashboard_Delivary_Rates.html')

admin_or_sub_admin_required
@app.route('/Admin_Dashboard/get_Delivary_Rates')
def Admin_Dashboard_get_Delivary_Rates():
    search_query = request.args.get('search', '').lower()
    if (search_query == "quweisna"):
        categories_ref = db.collection('constants')
        categories = [doc.to_dict() for doc in categories_ref.get()]
        Delivary_Rates = [category for category in categories ]
        Delivary_Rates=Delivary_Rates[0]["delivery"]["قويسنا"]
    elif(search_query == "sheben" ):
        categories_ref = db.collection('constants')
        categories = [doc.to_dict() for doc in categories_ref.get()]
        Delivary_Rates = [category for category in categories ]
        Delivary_Rates=Delivary_Rates[0]["delivery_shbeen"]["قويسنا"]
    elif(search_query == "banha" ):
        categories_ref = db.collection('constants')
        categories = [doc.to_dict() for doc in categories_ref.get()]
        Delivary_Rates = [category for category in categories ]
        Delivary_Rates=Delivary_Rates[0]["delivery_banha"]["قويسنا"]
    print("here")
    return jsonify({
        'Delivary_Rates': Delivary_Rates,
    })

admin_or_sub_admin_required
@app.route('/Admin_Dashboard/update_Delivary_Rate' ,methods=['GET', 'POST'])
def update_Delivary_Rate():
    data = request.get_json()
    
    key = data.get("key")  # Location
    new_rate = data.get("rate")  # Updated rate
    rate_type = data.get('where')
    delivery_rates_doc_ref = db.collection('constants').document('KBduReQFSnQFL4J18xBo')
    if (rate_type == "quweisna"):
        rate_type="delivery"
    elif(rate_type == "sheben" ):
        rate_type="delivery_shbeen"
    elif(rate_type == "banha" ):
        rate_type="delivery_banha"
    
    update_path = f"{rate_type}.قويسنا.{key}"
    try:
        # Update the specific location's rate in Firestore
        delivery_rates_doc_ref.update({update_path: float(new_rate)})
        return jsonify({"success": True, "message": "Rate updated successfully!"})
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to update rate: {str(e)}"}), 500




###############################################

@admin_required
@app.route('/Admin_Dashboard/login_wadely')
def Admin_Dashboard_wadely():
    categories_ref = db.collection('constants')
    categories = [doc.to_dict() for doc in categories_ref.get()]
    login_wadely = [category for category in categories ]
    return render_template('Admin_DASHBOARD_wadely.html',current_user=current_user,riders=login_wadely[0]['login_wadely'])

@admin_required
@app.route('/add_login_wadely', methods=['GET', 'POST'])
def add_login_wadely():
    if request.method == 'POST':
        users_ref = db.collection('constants')
        docs = users_ref.get()
        user_docs = [doc for doc in docs]
        login_wadely = user_docs[0].to_dict()["login_wadely"]
        login_wadely_1 = {
            "active": True,
            "name": request.form['name'],
            "password": request.form['password'],
            "phone": request.form['phone'],
            "total_orders": 0,
            "address":request.form['address']
        }
        login_wadely.append(login_wadely_1)
        user_docs[0].reference.update({"login_wadely": login_wadely})
        flash('Delivery man added successfully!', 'success')
        return redirect(url_for('add_login_wadely'))
    return render_template('Admin_DASHBOARD_wadely.html')


@admin_required
@app.route('/get_login_wadely', methods=['GET'])
def get_login_wadely():
    # Get the pagination parameters from the request
    rows_per_page = int(request.args.get('rows_per_page', 10))  # Default to 10 rows
    current_page = int(request.args.get('current_page', 1))  # Default to the first page

    # Fetch categories from your database (replace this with actual database query)
    login_wadely_ref = db.collection('constants')
    login_wadelys = [doc.to_dict() for doc in login_wadely_ref.get()]
    login_wadely = [login_wadely for login_wadely in login_wadelys ]
    login_wadely = login_wadely[0]['login_wadely']  # Replace with your database call
    total_login_wadely = len(login_wadely)  # Get the total number of categories

    # Calculate the start and end index based on current page and rows per page
    start_index = (current_page - 1) * rows_per_page
    end_index = start_index + rows_per_page
    paginated_login_wadely = login_wadely[start_index:end_index]

    # Calculate total number of pages
    total_pages = ceil(total_login_wadely / rows_per_page)
    print(total_pages)

    # Return the paginated data along with pagination info
    return jsonify({
        'login_wadely': paginated_login_wadely,
        'current_page': current_page,
        'total_pages': total_pages,
        'total_login_wadely': total_login_wadely,
    })


@admin_required
@app.route('/search_in_login_wadely')
def search_in_login_wadely():
    search_query = request.args.get('search', '').lower()
    rows_per_page = int(request.args.get('rows_per_page', 10))
    current_page = int(request.args.get('current_page', 1))
    login_wadely_ref = db.collection('constants')
    login_wadelys = [doc.to_dict() for doc in login_wadely_ref.get()]
    login_wadelys = [ride for ride in login_wadelys ]
    login_wadelys = login_wadelys[0]['login_wadely']
    # Filter categories by search_query
    filtered_login_wadely = [login_wadely for login_wadely in login_wadelys if search_query in login_wadely['name'].lower()]

    # Apply pagination (if needed)
    total_login_wadely = len(filtered_login_wadely)
    start = (current_page - 1) * rows_per_page
    end = start + rows_per_page
    paginated_login_wadely = filtered_login_wadely[start:end]
    print(paginated_login_wadely[0])
    return jsonify({
        'login_wadelys': paginated_login_wadely,
        'total_login_wadely': total_login_wadely,
        'total_pages': ceil(total_login_wadely / rows_per_page)
    })







#######################

@app.route('/firebase-config', methods=['GET'])
def get_firebase_config():
       
    # Send the Firebase config as JSON to the frontend
    return jsonify(firebase_config)


#id:count:size::totalprice

if __name__ == '__main__':
    app.run(debug=True)
