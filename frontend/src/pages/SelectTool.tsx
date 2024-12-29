import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function SelectTool() {
  const toolList = [
    { label: "NodeJs", key: "nodejs" },
    { label: "Python", key: "python" },
  ];

  const SLUG_WORKS = [
    "car",
    "dog",
    "computer",
    "person",
    "inside",
    "word",
    "for",
    "please",
    "to",
    "cool",
    "open",
    "source",
  ];

  function getRandomSlug() {
    let slug = "";

    for (let i = 0; i < 3; i++) {
      slug += SLUG_WORKS[Math.floor(Math.random() * SLUG_WORKS.length)];
    }

    return slug;
  }
  const navigate = useNavigate();
  const [replIdVal, setReplIdVal] = useState<any>(getRandomSlug());
  const [toolVal, setToolVal] = useState<any>("");

  const SERVICE_URL = "http://localhost:3000";

  const toolSelectHandler = async () => {
    await axios.post(`${SERVICE_URL}/project`, { replIdVal, toolVal });
    navigate(`/coding?replId=${replIdVal}`);
  };

  return (
    <>
      <Input
        className="max-w-xs text-2xl"
        placeholder="Enter replit ID"
        value={replIdVal}
        onValueChange={setReplIdVal}
      />

      <Select
        className="max-w-xs"
        label="Select Tool"
        onSelectionChange={(value: any) => setToolVal(value?.currentKey)}
      >
        {toolList.map((tool) => (
          <SelectItem key={tool.key}>{tool.label}</SelectItem>
        ))}
      </Select>

      <Button color="primary" isDisabled={!toolVal} onClick={toolSelectHandler}>
        Start Replit
      </Button>
    </>
  );
}
