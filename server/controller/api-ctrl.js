const mongo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
class ApiCtrl {
    static getEntries(req, res, next) {
        if(req.user && req.user.email) {
            mongo.getDb()
                .collection("entries")
                .find({email: req.user.email}, {projection: {_id: false, email: false}}).limit(50)
                .sort({date: -1})
                .limit(7)
                .toArray(function (err, result) {
                    if (err) {
                        res.status(400).send("Error fetching entries!");
                    } else {
                        res.json(result);
                    }
                });
        } else {
            res.send('Unauthorized', {status: 403});
        }
    }
    static createEntry(req, res, next) {
        if(req.user && req.user.email) {
            let entry = req.body;
            entry.email = req.user.email;
            if(entry && entry.details && entry.details.length > 0) {
                entry.details.forEach(function(part, index) {
                    this[index] = {detailId: new ObjectId(),...this[index]};
                  }, entry.details);
            }
            mongo.getDb()
                .collection("entries")
                .insertOne(entry, function (err, result) {
                    if (err) {
                      res.status(400).send("Error inserting entry!");
                    } else {
                      res.status(204).send();
                    }
                  });
        } else {
            res.status(403).send('Unauthorized');
        }
    }
    static createDetail(req, res, next) {
        if(req.user && req.user.email) {
            
            if(req.body) {
                let detail = req.body;
                detail.detailId = new ObjectId();
                mongo.getDb()
                .collection("entries")
                .updateOne(
                    {email: req.user.email, date: req.params.date},
                    {$push: { details: detail}}
                ).then((entry) => {
                    if(entry.matchedCount <=0 && entry.modifiedCount <= 0)
                    res.status(404).send("entry not found");
                    else res.status(204).send();
                }).catch((err) => {
                    res.status(400).send(err);
                });
            } else {
                res.status(400).send('Validation failure');
            }
            
        } else {
            res.status(403).send('Unauthorized');
        }
    }

    static setPreferences(req,res,next) {
        if(req.user && req.user.email) {

            mongo.getDb()
                .collection("users")
                .updateOne({email: req.user.email}, {$set: {"dailyLimit": req.body.dailyLimit}})
                .then(function(result){
                  if(result && result.modifiedCount > 0) {
                    res.status(204).send('Update successful');
                  } else if(result.matchedCount <= 0) {
                    res.status(404).send('User not found');          
                  } else {
                    res.status(200).send('Update not done');  
                  }
                });

        }else {
            res.status(403).send('Unauthorized');
        }
    }

    static deleteEntry(req,res,next) {
        if(req && req.user && req.user.email && req.params && req.params.entryId) {
            mongo.getDb()
                .collection("entries")
                .deleteOne({email: req.user.email, date: req.params.entryId})
                .then(function(result) {
                    if(result && result.deletedCount > 0) {
                        res.status(204).send('Delete successful');
                      } else {
                        res.status(404).send('entry not found');          
                      }
                });
        } else {
            res.status(400).send('Invalid Id');
        }
    }

    static deleteDetail(req,res,next) {
        if(req && req.user && req.user.email && req.params && req.params.entryId && req.params.detailId) {
            mongo.getDb()
                .collection("entries")
                .updateOne(
                    {email: req.user.email, date: req.params.entryId},
                    {$pull: { details: { detailId: ObjectId(req.params.detailId)}}}
                ).then((entry) => {
                    if(entry.matchedCount <=0 && entry.modifiedCount <= 0)
                    res.status(404).send("entry not found");
                    else res.status(204).send();
                }).catch((err) => {
                    res.status(400).send(err);
                });
        } else {
            res.status(400).send('Invalid Id');
        }
    }
}

module.exports = ApiCtrl;