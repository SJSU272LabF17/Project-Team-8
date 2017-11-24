let express = require('express');
let router = express.Router();
let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/student_assistant";

router.post('/resolveissue', function (req, res, next) {

    console.log("inside resolve Issues");
    console.log("req.body._id:"+req.body._id);


    mongo.connect(mongoURL, function () {

        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('users');
        console.log("inside the resolve Issues - mongo");

        coll.update({'issues_raised._id': req.body._id},
            {$push:
                {issue_resolved: {
                    "_id":req.body._id,
                    "topic":req.body.topic,
                    "issuecontent" : req.body.issuecontent,
                    "isopen" : "No"

                }}},
                function (err, user) {
                        console.log("inside call back" + user)
                        if (user) {

                            coll.update({'issues_raised._id': req.body._id},
                                {$pull:
                                    {issues_raised:{_id:req.body._id}}}
                                        ,function (err, user) {

                                                    if(user){
                                                        res.status(200).send({message:"Success"});
                                                    }
                                                    else
                                                    {
                                                        res.status(400).send({message:"Failed"});
                                                    }


                                                })

                                  }
                        else {
                                 res.status(400).send({message:"successful"});


                        }
            });



    });


});

module.exports = router;