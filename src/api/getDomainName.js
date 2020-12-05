import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeDomainResults } from "../utils/search";
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
    "/getDomains",
    asyncHandler(async (request, res, next) => {
      console.log(request.body.data[0].projectId);
      let projectId = request.body.data[0].projectId;
      let successStatus = false;
      let text = "SELECT tc.domain_value_id ,(select tmdv.description from tbl_master_data_value tmdv where  tmdv.key_id =6 and tmdv.value_id = tc.domain_value_id ) domain_desc FROM tbl_domain tc  where  tc.project_id='"+projectId+"' and tc.active = true";


      let sqlQuery = text;
      //console.log(sqlQuery);
      let domains = [];
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus:successStatus,
            ErrorMessage: err.stack
          };  
          res.json(response);          
        } else {
            domains =
            dbRes.rows && !isEmpty(dbRes.rows)
              ? await mergeDomainResults(
                dbRes.rows,
                request.query,
                request.body
              )
              : [];

              successStatus = true;
          let response = {
            Domains: domains,
            SuccessStatus:successStatus
          };
          res.json(response);
        }
      });

    })
  );
  return api;
};
