import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeClientContactResults } from "../utils/search";
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
    "/getClientContacts",
    asyncHandler(async (request, res, next) => {
      console.log(request.body.data[0].projectId);
      let projectId = request.body.data[0].projectId;
      let successStatus = false;
      let text = "SELECT tc.designation ,tc.person_name ,tc.emailid ,tc.phoneno FROM tbl_contact_details tc  where  tc.project_id ='"+projectId+"' and tc.active = true";


      let sqlQuery = text;
      //console.log(sqlQuery);
      let contacts = [];
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus:successStatus,
            ErrorMessage: err.stack
          };  
          res.json(response);          
        } else {
            contacts =
            dbRes.rows && !isEmpty(dbRes.rows)
              ? await mergeClientContactResults(
                dbRes.rows,
                request.query,
                request.body
              )
              : [];

              successStatus = true;
          let response = {
            Contacts: contacts,
            SuccessStatus:successStatus
          };
          res.json(response);
        }
      });

    })
  );
  return api;
};
