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
      var target_path = 'C://Project//Citation Repository//' + req.file.originalname;
      var src = fs.createReadStream(tmp_path);
      var dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      let dmsUrl = "http://10.31.13.205:8080";
      let dmsUsername = "admin";
      let dmsPassword = "RMS@123";
      let workflowSearchResponse = await searchPensionWorkflow(dmsUrl, dmsUsername, dmsPassword);

      let dmsTkt = workflowSearchResponse.ticket;

      let uploadResponse = await uploadDocument(dmsTkt, target_path);

      let dmsNodeId = uploadResponse.message.entry.id;

      let response = {
        DMSNodeId: dmsNodeId,
        SuccessStatus: dmsNodeId? true : false
      };
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
    hostURL: 'http://10.31.13.205:3000/',
    endPoint: 'dmsApi/loginToDms',
    requestBody: requestBody
  });

  console.log(workflowResponse);
  return workflowResponse;
};

export const uploadDocument = async (dmsTkt, filePathToUpload) => {

  let requestBody = {
    ticket: dmsTkt,
    uploadPath: 'Test',
    filePathToUpload: filePathToUpload
  };

  let workflowResponse = await httpRequest({
    hostURL: 'http://10.31.13.205:3000/',
    endPoint: 'dmsApi/uploadFile',
    requestBody: requestBody
  });

  console.log(workflowResponse);
  return workflowResponse;
};
