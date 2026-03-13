import { useState, useEffect } from "react";
import React from "react";

export default function GetAll() {
  const [rows, setRows] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [venue, setVenue] = useState("");
  const [time, setTime] = useState("");
  const [limit, setLimit] = useState<number | "all">("all");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const recordsPerPage = typeof limit === "number" ? limit : 10;

  // Fetch all rows from Prisma
  useEffect(() => {
    async function fetchMeetings() {
      const allMeetings = await fetch("/api/meetings").then(res => res.json());
      setRows(allMeetings);
      setTotalRecords(allMeetings.length);
    }
    fetchMeetings();
  }, []);
}