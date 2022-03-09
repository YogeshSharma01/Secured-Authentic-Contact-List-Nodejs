const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const db = require('./config/mongoose');
const Contact = require('./model/contact');
const User = require('./model/users');

const port = 8000;

app.use(express.urlencoded());

app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use('/static', express.static('static'))

const contactList = [
    {
        name:'Pankaj',
        phone: '1111111111'
    },
    {
        name:'Surbhi',
        phone:'222222222'
    },
    {
        name: 'Rohan',
        phone:'333333333'
    }
]

// connecting the schema to DB
app.get('/',(req,res)=>{
   
    Contact.find({}, function(err, contacts){
        if(err){
            console.log('Error infetching contacts from DB');
            return;
        }else{
           if(req.cookies.user_id){
               User.findById(req.cookies.user_id, (err,user)=>{
                if(user){
                    return res.render('index',{
                        title: 'Contact List',
                        contactlist:contacts,
                        user: user
                    });
                }
                return res.redirect('/signin');
               })
           }
           else{
            return res.redirect('/signin');
           } 
        }
    })

    
});





//  create user and send the info into DB
app.post('/create-contact', (req,res)=>{
    
    Contact.create({
        name: req.body.name,
        phone: req.body.phone
    }, function(err, newContact){
        if(err){
            console.log('Error in creating a contact in DB');
            return;
        }else{
            // console.log('Contact:', newContact);
            return res.redirect('back');
        }
    })
});


//  delete the data of the user from DB
app.get('/delete-contact', (req,res)=>{
    // get the id from query in the url
    let id = req.query.id;

    //  find the contact in the DB using id and delete it.
    Contact.findByIdAndDelete(id, function(err){
        if(err){
            console.log('Error in deleting the contact from DB');
        }
        return;
    });
    return res.redirect('/');
});

// signup page router 

app.get('/signup', (req,res)=>{
    return res.render('sign-up');
});

// signin page route

app.get('/signin', (req,res)=>{
    return res.render('sign-in');
});


// Sign up the user and allow to move on sign in page to get authenticate 

app.post('/create', (req,res)=>{
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, (err, user)=>{
        if(err){
            console.log('Error in finding the user in signing up');
            return;
        }
        if(!user){
            User.create(req.body, (err, user)=>{
                if(err){
                    console.log('Error in Signing up the user');
                    return;
                }       
                return res.redirect('/signin');
            })
        }else{
            return res.redirect('back');
        }
    })
})

// getting the data for the sign in users

app.post('/create-session', (req,res)=>{
    User.findOne({email:req.body.email}, (err, user)=>{
        if(err){console.log('Error in signing in the user'); return}

        if(user){
            if(user.password != req.body.password){
                res.redirect('back');
            }
            res.cookie('user_id', user.id);
            return res.redirect('/');
        }else{
            return res.redirect('back');
        }
    })
})

// signout 

app.post('/signout', (req,res)=>{
    if(req.cookies.user_id){
        res.clearCookie('user_id');
        return res.redirect('/signin');
    }

})




app.listen(port,(err)=>{
        if(err){
            console.log("Error in running server on port number", port);
            return;
        }else{
            console.log("Server is running fine on port number", port);
        }
});