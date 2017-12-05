const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
var nodeadmin = require("nodeadmin")
//connectare la baza de date sql
var sequelize = new Sequelize('manager_contacte', 'root', '', {
    dialect:'mysql',
    host:'localhost'
})

sequelize.authenticate().then(function(){
    console.log('Success')
})


//definim modelul Persoana
var Persoana = sequelize.define('persoana', {
    nume: Sequelize.STRING,
    porecla: Sequelize.STRING,
    domiciliu: Sequelize.TEXT,
    data_de_nastere:Sequelize.DATE
    
})

// definim modelul Contact
var Contact = sequelize.define('contact',{
   
    persoanaId: Sequelize.INTEGER,
    telefon: Sequelize.STRING,
    telefon_secundar: Sequelize.STRING,
    e_mail: Sequelize.STRING
    
    
})

Persoana.hasOne(Contact)
Contact.belongsTo(Persoana, {foreignKey: 'persoanaId', targetKey: 'id'})
const app = express()
app.use(bodyParser.json())




app.get('/create', (req, res, next) => {
  sequelize.sync({force : true})
    .then(() => res.status(201).send('Tabelele au fost create cu succes!'))
    .catch((err) => next({err : err, status : 500}))
})



// app.get('/persoane', (req, res, next) => {
//   Persoana.findAll()
//     .then((persoana) => res.status(200).json(persoana))
//     .catch((err) => next({err : err, status : 500}))
// })




// get lista persoane
app.get('/persoane', function(request, response) {
    Persoana.findAll().then(function(persoana){
        response.status(200).send(persoana)
    })
        
})

//POST: create a new person
app.post('/persoane', function(request, response) {
    Persoana.create(request.body).then(function(persoana) {
        response.status(201).send(persoana)
    })
})

// get one person by id
app.get('/persoane/:id', function(request, response) {
    Persoana.findOne({where: {id:request.params.id}}).then(function(persoana) {
        if(persoana) {
            response.status(200).send(persoana)
        } else {
            response.status(404).send('Nu s-a gasit persoana cu id-ul specificat!')
        }
    })
})
//PUT: editare persoana specificata dupa id
app.put('/persoane/:id', function(request, response) {
    Persoana.findById(request.params.id).then(function(persoana) {
        if(persoana) {
            persoana.update(request.body).then(function(persoana){
                response.status(201).send(persoana)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Nu s-a gasit persoana!')
        }
    })
})
// DELETE: stergem o persoana dupa id-ul specificat
app.delete('/persoane/:id', function(request, response) {
    Persoana.findById(request.params.id).then(function(persoana) {
        if(persoana) {
            persoana.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Nu s-a efectuat stergerea. Persoana specificata nu a fost gasita!')
        }
    })
})

// Cele 5 metode pentru modelul Contact
app.get('/contacte', function(request, response) {
    Contact.findAll(
        {
            include: [{
                model: Persoana,
                where: { id: Sequelize.col('contact.persoanaId') }
            }]
        }
        
        ).then(
            function(contact) {
                response.status(200).send(contact)
            }
        )
})


app.get('/contacte/:id', function(request, response) {
    Contact.findById(request.params.id).then(
            function(contact) {
                response.status(200).send(contact)
            }
        )
})

app.post('/contacte', function(request, response) {
    Contact.create(request.body).then(function(contact) {
        response.status(201).send(contact)
    })
})

app.put('/contacte/:id', function(request, response) {
    Contact.findById(request.params.id).then(function(contact) {
        if(contact) {
            contact.update(request.body).then(function(contact){
                response.status(201).send(contact)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Nu s-a realizat ediatarea. Contactul nu a fost gasit.')
        }
    })
})

app.delete('/contacte/:id', function(request, response) {
    Contact.findById(request.params.id).then(function(contact) {
        if(contact) {
            contact.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Nu a fost gasit contactul!')
        }
    })
})

app.get('/persoane/:id/contacte', function(request, response) {
    Contact.findAll({where:{persoanaId: request.params.id}}).then(
            function(contact) {
                response.status(200).send(contact)
            }
        )
})




//initializam implicit 2 instante de tip persoana si contact
// const persoana1 = Persoana.build({
//   nume: 'Radu Anca',
//   domiciliu: 'Strada Lalelelor',
//   porecla: 'Ancuta',
//   data_de_nastere: '12-12-1990'
// })

// const contact1= Contact.build({
//     //persoanaId:'1',
//     telefon:'0726 818 839',
//     telefon_secundar: '012 312 1253',
//     e_mail:'radu.anca@gmail.com'
// })
//  contact1.save()
// persoana1.save()

app.listen(8080)
