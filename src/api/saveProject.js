import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeUserResults, mergeAssignmentResults, mergeServiceHistoryResults, mergePensionEmployeeResults } from "../utils/search";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import some from "lodash/some";
import { actions } from "../utils/search";
import { validatePensionNotificationRegisterSearchModel } from "../utils/modelValidation";
import envVariables from "../envVariables";
import mdmsData from "../utils/mdmsData";
import filter from "lodash/filter";
import { encrypt } from "../utils/encryption";
const asyncHandler = require("express-async-handler");

export default ({ config, db }) => {
  let api = Router();
  api.post(
    "/saveProject",
    asyncHandler(async (request, res, next) => {
      //console.log(request.body.RequestInfo);

      let successStatus = false;

      let data = request.body;

      let strData = JSON.stringify(data);

      let text = "SELECT public.fn_save_project('" + strData + "');fetch all from ref1;";

      console.log(text);
      let sqlQuery = text;
      //console.log(sqlQuery);

      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus: successStatus,
            ErrorMessage: err.stack
          };
          res.json(response);
        } else {

          dbRes[1].rows[0] && !isEmpty(dbRes[0].rows[0])
            ? dbRes[1].rows[0]['application_number']
            : [];
          successStatus = true;

          let response = {

            SuccessStatus: successStatus
          };
          res.json(response);
        }
      });

    })
  );
  return api;
};
