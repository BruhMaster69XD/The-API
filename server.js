
const sqlite = require('sqlite3').verbose();
let db = my_database('./phones5.db');



var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());





app.post('/iPhone', function(req,res){

	db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
	["Apple", "Iphone 11", "IOS", "https://images.fixjeiphone.nl/wp-content/uploads/2021/03/Refurbished-iPhone-11-Pro-Max-groen-1.png", "5.40"], function(err, rows){
		
		


		return res.json(rows)
	});
	

});

app.post('/Samsung', function(req,res){

	db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
	["Samsung", "Galaxy s21", "Android", "https://media.s-bol.com/Y5qOEKNz67XA/550x739.jpg", "5.54"], function(err, rows){



		return res.json(rows)
	});
	

});

app.put('/updateToHuawei/:id', function(req, res){
	db.run(`UPDATE phones
                    SET brand=?, model=?, os=?, image=?,
                    screensize=? WHERE id=?`,
                    ["Huawei", "Huawei p30 pro", "Android", "https://used2cell.nl/wp-content/uploads/2020/03/huawei-P30-Pro-zwart.jpg", "4.44", req.params.id], function(err, rows){
			
		if (isNaN(id)) return res.status(400).send("You can only input integers")
		else return res.json(rows)
	});

});

app.put('/updateToSamsung/:id', function(req, res){
	db.run(`UPDATE phones
                    SET brand=?, model=?, os=?, image=?,
                    screensize=? WHERE id=?`,
                    ["Samsung", "Galaxy S21", "Android", "https://media.s-bol.com/Y5qOEKNz67XA/550x739.jpg", "5.54", req.params.id], function(err, rows){


		return res.json(rows)
	});

});

app.put('/updateToApple/:id', function(req, res){
	db.run(`UPDATE phones
                    SET brand=?, model=?, os=?, image=?,
                    screensize=? WHERE id=?`,
                    ["Apple", "Iphone 11", "IOS", "https://images.fixjeiphone.nl/wp-content/uploads/2021/03/Refurbished-iPhone-11-Pro-Max-groen-1.png", "5.40", req.params.id], function(err, rows){


		return res.json(rows)
	});

});

app.put('/updateToNokia/:id', function(req, res){
	db.run(`UPDATE phones
                    SET brand=?, model=?, os=?, image=?,
                    screensize=? WHERE id=?`,
                    ["Nokia", "Lumia 930", "Microsoft", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Microsoft_Nokia_Lumia_930.jpg/800px-Microsoft_Nokia_Lumia_930.jpg", "5.50", req.params.id], function(err, rows){


		return res.json(rows)
	});

});


app.delete('/delete/:id', function(req, res){
	var id = req.params.id;
	db.run("DELETE FROM phones WHERE id=" + id, function(err, rows) {
       
		 if(isNaN(id)) return res.status(400).send("You can only use numbers to find the ID bossman. ;)")
		else if(id>10) return res.status(403).send("Non premium members can only edit the first 10 phones")
		else return res.json(rows)
	});

});	


app.get('/phones/:brand', function(req, res) {// search for a specific brand.
	var brand = req.params.brand;
  db.all(`SELECT * FROM phones WHERE brand=?`,brand, function(err, rows) {
		/*if (err) {
			console.log(err);
			res.status(404).json({"ERROR": "The given brand does not exist"});	
  		}*/
	if (brand === "Apple") res.status(403).send('Non premium customers cant look at our apple products')
	else if (!isNaN(brand)) res.status(400).send('Chief, you cannot use numbers to look for brands. -_-')
	else if (brand === "Samsung") return res.json(rows)
	else if (brand === "Fairphone") return res.json(rows)
	else if ( brand === "Nokia") return res.json(rows)
	else return res.status(404).send("Couldnt find your brand. :(")
		  
    });
	//const phnone_brand = phones.find(pb => pb.brand === req.params.brand);
    //if(!req.params.brand) res.status(404).json({error: 'The course with the given brand was not found'});
	//if (!brand){res.status(404).json({"ERROR": "The given brand does not exist"});
//}

	
});


app.get('/tableContents', function(req, res) {// search for a specific brand.
    // Example SQL statement to select the name of all products from a specific brand
    db.all(`SELECT * FROM phones `, function(err, rows) {
		//if (err) {
		//	console.error(err.message);
			
  	//	}
		 
		
		
    	return res.json(rows)
    });
	//const phnone_brand = phones.find(pb => pb.brand === req.params.brand);
    //if(!req.params.brand) res.status(404).json({error: 'The course with the given brand was not found'});

	
});


app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");

function my_database(filename) {
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
				["Fairphone", "FP3", "Android", "https://upload.wsikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
				console.log('Inserted dummy phone entry into empty database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	}); 
	return db;
}
