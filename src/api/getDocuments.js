import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeDocumentResults } from "../utils/search";
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
    "/getDocuments",
    asyncHandler(async (request, res, next) => {
      console.log(request.body.data[0].projectId);
      let projectId = request.body.data[0].projectId;
      let successStatus = false;
      let text = "SELECT td.node_id ,td.document_id , td.document_name ,(select tmdv.description from tbl_master_data_value tmdv where  tmdv.key_id =3 and tmdv.value_id = td.document_type_id ) document_type FROM tbl_document td  where  td.project_id='"+projectId+"' and td.active = true";


      let sqlQuery = text;
      //console.log(sqlQuery);
      let documents = [];
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus:successStatus,
            ErrorMessage: err.stack
          };  
          res.json(response);          
        } else {
            documents =
            dbRes.rows && !isEmpty(dbRes.rows)
              ? await mergeDocumentResults(
                dbRes.rows,
                request.query,
                request.body
              )
              : [];

              successStatus = true;
          let response = {
            Documents: documents,
            SuccessStatus:successStatus
          };
          res.json(response);
        }
      });

    })
  );
  return api;
};
