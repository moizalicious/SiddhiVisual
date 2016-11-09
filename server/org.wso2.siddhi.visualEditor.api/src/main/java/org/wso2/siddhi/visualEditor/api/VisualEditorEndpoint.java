package org.wso2.siddhi.visualEditor.api;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import com.google.gson.Gson;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/visual-editor")
public class VisualEditorEndpoint {
    @GET
    public Response generateQuery(String executionPlan) {
        String jsonString = "API works fine";

        return Response.ok(jsonString, MediaType.APPLICATION_JSON)
                .header("Access-Control-Allow-Origin", "*")
                .build();
    }
}
