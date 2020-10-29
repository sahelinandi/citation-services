import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeProjectDataResults } from "../utils/search";
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
    "/getProjects",
    asyncHandler(async (request, res, next) => {
      //console.log(request.body.RequestInfo);

      let successStatus = false;

      let projectName = request.body.data[0].projectName;

      let text = "SELECT p.project_id, p.project_name, p.client_name, p.project_start_date, p.project_end_date from tbl_project p where p.active = true and p.project_name = '"+ projectName+"'";


      let sqlQuery = text;
      /* if (gender != null) {
        sqlQuery = sqlQuery + " join tbl_master_data_value mdv on mdv.value_id = a.gender join tbl_master_data_key mdk on mdk.key_id = mdv.key_id and mdk.Key_code = 'GENDER' and mdv.value_code='GENDER_" + gender + "'";

      }

      sqlQuery = sqlQuery + " where a.active = true "

 */
      //console.log(sqlQuery);
      let projectData = [];
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus: successStatus,
            ErrorMessage: err.stack
          };
          res.json(response);
        } else {
          projectData =
            dbRes.rows && !isEmpty(dbRes.rows)
            ? await mergeProjectDataResults(
              dbRes.rows,
              request.query,
              request.body
            )
            : [];

          successStatus = true;

          let response = {
            ProjectData: projectData,
            SuccessStatus: successStatus
          };
          res.json(response);
        }
      });

    })
  );
  return api;
};
