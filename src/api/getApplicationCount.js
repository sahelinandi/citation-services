import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeUserResults,mergeAssignmentResults,mergeServiceHistoryResults,mergePensionEmployeeResults } from "../utils/search";
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
    "/getApplicationCount",
    asyncHandler(async (request, res, next) => {       
      //console.log(request.body.RequestInfo);

      let successStatus = false;

      let gender = request.body.Gender;
     
     let text ="SELECT count(*) as application_count from tbl_application a ";
      
    
      let sqlQuery = text;      
      if(gender!=null){
        sqlQuery=sqlQuery+" join tbl_master_data_value mdv on mdv.value_id = a.gender join tbl_master_data_key mdk on mdk.key_id = mdv.key_id and mdk.Key_code = 'GENDER' and mdv.value_code='GENDER_" +gender+"'";

      }

      sqlQuery=sqlQuery+" where a.active = true "

      
      //console.log(sqlQuery);
      let applicationCount=0;
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus:successStatus,
            ErrorMessage: err.stack
          };  
          res.json(response);          
        } else {        
          applicationCount =
              dbRes.rows && !isEmpty(dbRes.rows)
                ? dbRes.rows[0]["application_count"]
                : [];  
          
          successStatus = true;

          let response = {
            ApplicationCount:applicationCount,
            SuccessStatus:successStatus
          };                                
          res.json(response);          
        }  
      });    
      
    })
  );
  return api;
};
