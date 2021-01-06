import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeMasterDataResults } from "../utils/search";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import some from "lodash/some";
import { actions } from "../utils/search";
import { validatePensionNotificationRegisterSearchModel } from "../utils/modelValidation";
import envVariables from "../envVariables";
import mdmsData from "../utils/mdmsData";
import filter from "lodash/filter";
import { httpRequest } from "../utils/api";
const asyncHandler = require("express-async-handler");
var express = require('express');
var multer = require('multer');
var fs = require('fs');
var http = require('http');
const request = require('request');

export default ({ config, db }) => {
  let api = Router();
  api.use(express.json());
  api.use(express.urlencoded({ extended: true }));

  api.use(express.static('public'));
  var upload = multer({ dest: 'C://Project//Citation Repository//' });
  var type = upload.single('FileToUpload');
  api.post(
    "/uploadFile", type,
    asyncHandler(async (req, res, next) => {

      console.log(req.file);
      let successStatus = false;
      var tmp_path = req.file.path;
      console.log("req.file.originalname"+ req.file.originalname);
      var filename = req.file.originalname;
      var fileNameStr= filename.substring(0,filename.indexOf('.')); 
      console.log("file name str==>"+fileNameStr);
      var fileExt = filename.substring(filename.indexOf('.')); 
      console.log("file fileExt str==>"+fileExt);
     // var target_path = 'C://Project//Citation Repository//' + req.file.originalname;
     let date_ob = new Date();

     // current date
     // adjust 0 before single digit date
     let date = ("0" + date_ob.getDate()).slice(-2);
     
     // current month
     let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
     
     // current year
     let year = date_ob.getFullYear();
     
     // current hours
     let hours = date_ob.getHours();
     
     // current minutes
     let minutes = date_ob.getMinutes();
     
     // current seconds
     let seconds = date_ob.getSeconds();
     var target_path = 'C://Project//Citation Repository//' + fileNameStr +"-" +year + "-" + month + "-" + date +"T"+  hours + " " + minutes + " " + seconds + fileExt
      var src = fs.createReadStream(tmp_path);
      var dest = fs.createWriteStream(target_path);
      src.pipe(dest); 

      let dmsUrl = envVariables.dmsUrl;// "http://10.31.13.205:8080";
      let dmsUsername = envVariables.dmsUsername;//"admin";
      let dmsPassword = envVariables.dmsPassword;///"RMS@123";
      let workflowSearchResponse = await searchPensionWorkflow(dmsUrl, dmsUsername, dmsPassword);

      let dmsTkt = workflowSearchResponse.ticket;

      let uploadResponse = await uploadDocument(dmsTkt, target_path);

      let dmsNodeId = uploadResponse.message.entry.id;

      let response = {
        DMSNodeId: dmsNodeId,
        SuccessStatus: dmsNodeId? true : false
      };
      fs.unlinkSync(target_path);
      fs.unlinkSync(tmp_path);
      res.json(response);
 




    })
  );
  return api;
};

export const searchPensionWorkflow = async (dmsUrl, dmsUserName, dmsPassword) => {
  let requestBody = {
    dmsUrl: dmsUrl,
    dmsUserName: dmsUserName,
    dmsPassword: dmsPassword
  };

  let workflowResponse = await httpRequest({
  //  hostURL: 'http://10.31.13.205:3000/',
   hostURL: 'http://localhost:3000/',
    endPoint: 'dmsApi/loginToDms',
    requestBody: requestBody
  });

  console.log(workflowResponse);
  return workflowResponse;
};

export const uploadDocument = async (dmsTkt, filePathToUpload) => {
  let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
//let hours = date_ob.getHours();

// current minutes
//let minutes = date_ob.getMinutes();

// current seconds
//let seconds = date_ob.getSeconds();


  let requestBody = {
    ticket: dmsTkt,
    uploadPath: 'Test/'+year + "-" + month + "-" + date ,//+ "-" + hours ,//+ ":" + minutes + ":" + seconds,
    filePathToUpload: filePathToUpload
  };

  let workflowResponse = await httpRequest({
   // hostURL: 'http://10.31.13.205:3000/',
   hostURL: 'http://localhost:3000/',
    endPoint: 'dmsApi/uploadFile',
    requestBody: requestBody
  });

  console.log(workflowResponse);
  return workflowResponse;
};
