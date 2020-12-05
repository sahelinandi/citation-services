import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeTechnologyResults } from "../utils/search";
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
    "/getTechnologies",
    asyncHandler(async (request, res, next) => {
      console.log(request.body.data[0].projectId);
      let projectId = request.body.data[0].projectId;
      let successStatus = false;
      let text = "SELECT tc.technology_value_id ,(select tmdv.description from tbl_master_data_value tmdv where  tmdv.key_id =5 and tmdv.value_id = tc.technology_value_id ) technlogy_desc FROM tbl_technology tc  where  tc.project_id='"+projectId+"' and tc.active = true";


      let sqlQuery = text;
      //console.log(sqlQuery);
      let technologies = [];
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus:successStatus,
            ErrorMessage: err.stack
          };  
          res.json(response);          
        } else {
            technologies =
            dbRes.rows && !isEmpty(dbRes.rows)
              ? await mergeTechnologyResults(
                dbRes.rows,
                request.query,
                request.body
              )
              : [];

              successStatus = true;
          let response = {
            Technologies: technologies,
            SuccessStatus:successStatus
          };
          res.json(response);
        }
      });

    })
  );
  return api;
};
