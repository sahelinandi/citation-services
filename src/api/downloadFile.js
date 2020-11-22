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
var path = require('path');

export default ({ config, db }) => {
  let api = Router();
  api.use(express.json());
  api.use(express.urlencoded({ extended: true }));

  api.use(express.static('public'));
  var upload = multer({ dest: 'C://Project//Citation Repository//' });
  var type = upload.single('FileToUpload');
  api.post(
    "/downloadFile", type,
    asyncHandler(async (req, res, next) => {
      //console.log("download file name==>"+res.file_name);
      const target_path = 'C://Project//Citation Repository//Download';
      //res.download(file);

      /* var filename = path.basename(file);
      var mimetype = mime.lookup(file);

      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype); */

      
      //filestream.pipe(res);
      console.log("nodeid::"+ req.body.nodeid);
      let nodeId = req.body.nodeid;
      let dmsUrl = "http://10.31.13.205:8080";
      let dmsUsername = "admin";
      let dmsPassword = "RMS@123";
      let workflowSearchResponse = await searchPensionWorkflow(dmsUrl, dmsUsername, dmsPassword);

      let dmsTkt = workflowSearchResponse.ticket;

      let uploadResponse = await downloadDocument(dmsTkt, nodeId, target_path);

        const file = target_path + "/" + uploadResponse.file_name;//let dmsNodeId = uploadResponse.message.entry.id;



      var filestream = fs.readFileSync(file);
      res.json({ filestream : filestream.toString('base64')});




                         

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
    hostURL: 'http://localhost:3000/',
    endPoint: 'dmsApi/loginToDms',
    requestBody: requestBody
  });

  console.log(workflowResponse);
  return workflowResponse;
};

export const downloadDocument = async (dmsTkt, nodeId,downloadPath) => {

  let requestBody = {
    ticket: dmsTkt,
   /* downloadPath: 'Test',
    filePathToUpload: filePathToUpload*/
    downloadPath: downloadPath,
    nodeId: nodeId
  };
console.log("downloadPath"+downloadPath);
  let workflowResponse = await httpRequest({
    hostURL: 'http://localhost:3000/',
    endPoint: 'dmsApi/downloadFile',
    requestBody: requestBody
  });

  console.log(workflowResponse);
  return workflowResponse;
};
