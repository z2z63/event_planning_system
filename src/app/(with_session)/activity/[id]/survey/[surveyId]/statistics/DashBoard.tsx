"use client";
import { useEffect, useState } from "react";
import "survey-analytics/survey.analytics.min.css";
import { Model } from "survey-core";
import { VisualizationPanel } from "survey-analytics";

const vizPanelOptions = {
  allowHideQuestions: false,
};

export default function DashBoard({
  surveyJson,
  surveyResults,
}: {
  surveyJson: any;
  surveyResults: any[];
}) {
  const [survey, setSurvey] = useState<Model>(() => new Model(surveyJson));
  const [vizPanel, setVizPanel] = useState<VisualizationPanel>(() => {
    const vizPanel = new VisualizationPanel(
      survey.getAllQuestions(),
      surveyResults,
      vizPanelOptions,
    );
    vizPanel.showToolbar = false;
    return vizPanel;
  });

  useEffect(() => {
    vizPanel.render("surveyVizPanel");
    return () => {
      const element = document.getElementById("surveyVizPanel");
      if (element !== null) {
        element.innerHTML = "";
      }
    };
  }, [vizPanel]);

  return <div id="surveyVizPanel" />;
}
