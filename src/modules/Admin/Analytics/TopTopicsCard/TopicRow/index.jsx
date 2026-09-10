"use client";
// modules/Admin/Analytics/TopTopicsCard/TopicRow/index.jsx

import { S } from "../../styles";
import { MODULES } from "../../constants";

export default function TopicRow({ topic, maxComp }) {
  return (
    <div style={S.topicRow}>
      <div style={{ flex: 2, minWidth: 0 }}>
        <p style={S.topicTitle}>{topic.title}</p>
        <p style={S.topicMeta}>{MODULES[topic.moduleId]} · {topic.readTime}</p>
      </div>
      <div style={{ flex: 1 }}>
        <div style={S.barBg}>
          <div style={{ ...S.barFill, width: `${(topic.completions / maxComp) * 100}%` }} />
        </div>
      </div>
      <span style={S.compCount}>{topic.completions?.toLocaleString()}</span>
      <span style={S.avgTime}>{topic.avgTime}</span>
    </div>
  );
}
