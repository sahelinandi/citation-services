import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeSubSBUResults } from "../utils/search";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import some from "lodash/some";
import { actions } from "../utils/search";
import { validatePensionNotificationRegisterSearchModel } from "../utils/modelValidation";
import envVariables from "../envVariables";
import mdmsData from "../utils/mdmsData";
import filter from "lodash/filter";
const asyncHandler = require("express-async-handler");

export default ({ config, db }) => {
  let api = Router();
  api.post(
    "/getSubSBU",
    asyncHandler(async (request, res, next) => {
      //console.log(request.body.RequestInfo);
      let successStatus = false;
      let text = "SELECT sub_sbu_id, code, name FROM tbl_sub_sbu where active = true";


      let sqlQuery = text;
      //console.log(sqlQuery);
      let subSBUs = [];
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus:successStatus,
            ErrorMessage: err.stack
          };  
          res.json(response);          
        } else {
          subSBUs =
            dbRes.rows && !isEmpty(dbRes.rows)
              ? await mergeSubSBUResults(
                dbRes.rows,
                request.query,
                request.body
              )
              : [];

              successStatus = true;
          let response = {
            SubSBUs: subSBUs,
            SuccessStatus:successStatus
          };
          res.json(response);
        }
      });

    })
  );
  return api;
};
