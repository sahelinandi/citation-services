import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeProjectTypeResults } from "../utils/search";
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
    "/getProjectType",
    asyncHandler(async (request, res, next) => {
      //console.log(request.body.RequestInfo);

      let successStatus = false;
      let subSBUId = request.body.subSBUId;

      let text = "SELECT project_type_id, code, name FROM tbl_project_type where active = true and sub_sbu_id=" + subSBUId;

      let sqlQuery = text;
      //console.log(sqlQuery);
      let projectTypes = [];
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus: successStatus,
            ErrorMessage: err.stack
          };
          res.json(response);
        } else {
          projectTypes =
            dbRes.rows && !isEmpty(dbRes.rows)
              ? await mergeProjectTypeResults(
                dbRes.rows,
                request.query,
                request.body
              )
              : [];

          successStatus = true;
          let response = {
            ProjectTypes: projectTypes,
            SuccessStatus: successStatus
          };
          res.json(response);
        }
      });

    })
  );
  return api;
};
