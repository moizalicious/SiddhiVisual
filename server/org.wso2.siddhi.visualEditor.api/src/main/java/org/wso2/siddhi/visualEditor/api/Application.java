package org.wso2.siddhi.visualEditor.api;

import org.wso2.msf4j.MicroservicesRunner;

/**
 * Created by pamoda on 11/7/16.
 */
public class Application {
    public static void main(String[] args) {
        new MicroservicesRunner().deploy(new VisualEditorEndpoint()).start();
    }
}