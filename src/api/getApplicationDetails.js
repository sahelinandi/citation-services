import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeApplicationDataResults } from "../utils/search";
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
    "/getApplicationDetails",
    asyncHandler(async (request, res, next) => {
      //console.log(request.body.RequestInfo);

      let successStatus = false;

      let gender = request.body.Gender;

      let text = "SELECT a.application_number, CONCAT(a.first_name, ' ', a.last_name) as applicant_name, a.mobile from tbl_application a";


      let sqlQuery = text;
      if (gender != null) {
        sqlQuery = sqlQuery + " join tbl_master_data_value mdv on mdv.value_id = a.gender join tbl_master_data_key mdk on mdk.key_id = mdv.key_id and mdk.Key_code = 'GENDER' and mdv.value_code='GENDER_" + gender + "'";

      }

      sqlQuery = sqlQuery + " where a.active = true "


      //console.log(sqlQuery);
      let applicationData = [];
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus: successStatus,
            ErrorMessage: err.stack
          };
          res.json(response);
        } else {
          applicationData =
            dbRes.rows && !isEmpty(dbRes.rows)
            ? await mergeApplicationDataResults(
              dbRes.rows,
              request.query,
              request.body
            )
            : [];

          successStatus = true;

          let response = {
            ApplicationData: applicationData,
            SuccessStatus: successStatus
          };
          res.json(response);
        }
      });

    })
  );
  return api;
};
