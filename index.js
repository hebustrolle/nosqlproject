const express = require('express');
const app = express();
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
const {ObjectId} = require('mongodb');
var prenomgeneral = '';
var idgeneral = '';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/Acceuil', function (req, res) {
  res.render('acceuil.ejs');
});


app.get('/connexion', function (req, res) {
  res.render('connexion.ejs');
});

app.post('/ajoutercommentaire', function (req, res) {
  var commentaire= req.body.comm;
  var id = req.body.id_comm;
  var maintenant=new Date();
  console.log(id);
  console.log(commentaire);



      MongoClient.connect("mongodb://localhost:27017/nosqldatabase", (error, client) => {
        const db = client.db('nosqldatabase');
       db.collection("Composant").findOneAndUpdate(
      { _id: ObjectId(id)},
      {  $addToSet: { Commentaire: {commentaire: commentaire, login: prenomgeneral, date: maintenant} } }
  );
      });



    res.redirect('seecomposant');
});
app.post('/ajouternote', function (req, res) {
var note= req.body.note;
var id = req.body.id;
console.log(note);
console.log(prenomgeneral);
var maintenant=new Date();



    MongoClient.connect("mongodb://localhost:27017/nosqldatabase", (error, client) => {
      const db = client.db('nosqldatabase');
     db.collection("Composant").findOneAndUpdate(
    { _id: ObjectId(id)},
    {  $addToSet: { note: {note: note, login: prenomgeneral, date: maintenant} } }
);
    });



  res.redirect('seecomposant');
});

app.post('/ajouterpanier', function (req, res) {
    var marque= req.body.marque;
    var prix= req.body.prix;
    var nom= req.body.nom;
    var type= req.body.type;
    console.log(marque);
    console.log(prix);
    console.log(nom);
    console.log(type);
    console.log(prenomgeneral);
    console.log(idgeneral);
    console.log(req.body);
  //  var objNew = { _id : idgeneral};

    MongoClient.connect("mongodb://localhost:27017/nosqldatabase", (error, client) => {
      const db = client.db('nosqldatabase');
      db.collection("User").findOneAndUpdate(
    { _id: ObjectId(idgeneral)},
    {  $addToSet: { panier: req.body } }
);
    });

  //  console.log(result.marque);
  //  res.send('ok');
  res.redirect('seecomposant');
});


app.get('/acceuilconnecter', function (req, res) {
  res.render('acceuilconnecter.ejs');
});

app.get('/seecomposant', function (req, res) {
  tabdecomp = [];
  var callback = function(){
  //  console.log(tabdecomp);
  };
  MongoClient.connect("mongodb://localhost:27017/nosqldatabase", (error, client) => {
    const db = client.db('nosqldatabase');
    if (error) {
      return funcCallback(error);
    }else{
      console.log("Connecté à la base de données 'nosqldatabase'");
    }

      db.collection("Composant").find().toArray(function (error, results) {
          if (error) throw error;
//console.log(results);
  res.render('seecomposant.ejs', {resultat : results});
      });
      });





});







app.get('/seeoldcommande', function (req, res) {
  MongoClient.connect("mongodb://localhost:27017/nosqldatabase", (error, client) => {
        const db = client.db('nosqldatabase');
    db.collection("User").findOne({_id : ObjectId(idgeneral)} ,function(error, result) {

          console.log(result.commande);
          res.render('seeoldcommande.ejs', {commande: result.commande});
        });




  });
});


app.post('/commandevalide', function (req, res) {



  MongoClient.connect("mongodb://localhost:27017/nosqldatabase", (error, client) => {



        const db = client.db('nosqldatabase');
    db.collection("User").findOne({_id : ObjectId(idgeneral)} ,function(error, result) {

          console.log(result.panier);

          db.collection("User").findOneAndUpdate(
        { _id: ObjectId(idgeneral)},
        {  $addToSet: { commande: result.panier } }
      );

        });




  });


  res.render('acceuilconnecter.ejs');
});

app.get('/seepanier', function (req, res) {



  MongoClient.connect("mongodb://localhost:27017/nosqldatabase", (error, client) => {
  const db = client.db('nosqldatabase');
  db.collection("User").findOne({_id : ObjectId(idgeneral)} ,function(error, result) {

        console.log(result.panier);
        res.render('seepanier.ejs',  {panierenvoie: result.panier});
      });
    });


  });






app.get('/ajout', function (req, res) {
  res.render('ajout.ejs');
});

app.post('/ajout', function (req, res) {

  var nom = req.body.nom;
  var name= req.body.name;
  var type=req.body.type;
  var codebar=req.body.codebar;
  var stock=req.body.stock;
  var desc=req.body.desc;
  var price=req.body.price;
  var typecompat=req.body.typecompat;
  var marquecompat=req.body.marquecompat;
 var tabnote = [{note : '5', login: 'admin', date:'xxx'}]

  var objNew = {nom: nom, marque: name, type: type, codebar: codebar, stock: stock, description: desc, prix: price, compatible: {type: typecompat, marque: marquecompat}, note: tabnote};


  MongoClient.connect("mongodb://localhost:27017/nosqldatabase", (error, client) => {
    const db = client.db('nosqldatabase');
    if (error) {
      return funcCallback(error);
    }else{
      console.log("Connecté à la base de données 'nosqldatabase'");
    }

    db.collection("Composant").insert(objNew, null, function (error, results) {
      if (error) throw error;
      console.log("Le document a bien été inséré");
    });







  });



  console.log(name);
  console.log(type);
  console.log(codebar);
  console.log(stock);
  console.log(desc);
  console.log(price);
  console.log(typecompat);
  console.log(marquecompat);
  res.render('acceuilconnecter.ejs');
});



app.post('/connexion', function (req, res) {
  var pseudo= req.body.pseudo;
  var mdp=req.body.pass;



  MongoClient.connect("mongodb://localhost:27017/nosqldatabase", (error, client) => {
    const db = client.db('nosqldatabase');;
    if (error) {
      return funcCallback(error);
    }else{
      console.log("Connecté à la base de données 'nosqldatabase'");
    }
    var objToFind     =  {"identifiant" : {"identifiant": "abdoulepseudo"}};
    db.collection("User").findOne({'identifiant.identifiant' : pseudo} ,function(error, result) {
      if (error){
        console.log(error);
      } else{
        if(result != null){
          console.log(// 53dfe7bbfd06f94c156ee96e
            "Nom : " + result.name + "\n"  +         // Adrian Shephard
            "Prenom : " + result.firstname                  // Half-Life: Opposing Force
          );
          idgeneral = result._id;
          prenomgeneral = result.identifiant.identifiant;
          res.redirect('/acceuilconnecter');
        }else{
          res.render('connexion.ejs');
        }
      }
    });
  });


});



app.get('/inscription', function (req, res) {
  res.render('inscription.ejs');
});


app.post('/inscription', function (req, res) {
  var identifiant = req.body.identifiant;
  var name = req.body.name;
  var firstname = req.body.firstname;
  var numstreet = req.body.numstreet;
  var street = req.body.street;
  var city = req.body.city;
  var cp = req.body.cp;
  var country = req.body.country;
  var password = req.body.password;
  var phone = req.body.phone;
  var objNew = { identifiant: {identifiant, password}, name: name, firstname: firstname, adresse: { numstreet: numstreet, street: street, city: city, cp: cp, country: country }, phone: phone};

  MongoClient.connect("mongodb://localhost:27017/nosqldatabase", (error, client) => {
    const db = client.db('nosqldatabase');;
    if (error) {
      return funcCallback(error);
    }else{
      console.log("Connecté à la base de données 'nosqldatabase'");
    }




    db.collection("User").findOne({'identifiant.identifiant' : identifiant} ,function(error, result) {
      if (error){
        console.log(error);
      } else{
        if(result != null){
          console.log('on fait rien');

          res.render('inscription.ejs', {probleme: "Nous n'avons pas put vous inscrire"});
        }else{

          db.collection("User").insert(objNew, null, function (error, results) {
            if (error) throw error;
            console.log("Le document a bien été inséré");
          });

          res.render('inscription.ejs');
        }
      }
    });



  });




  console.log(identifiant);
  console.log(name);
  console.log(firstname);
  console.log(numstreet);
  console.log(street);
  console.log(city);
  console.log(cp);
  console.log(country);
  console.log(password);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
