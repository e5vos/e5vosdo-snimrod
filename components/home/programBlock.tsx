"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Chip,
  Spinner,
  Button,
} from "@heroui/react";
import { ClassProgram } from "@/db/classPrograms";

const ProgramBlock = () => {
  const [programs, setPrograms] = useState<ClassProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/classPrograms/getPrograms");
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.class.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl bg-selfprimary-100 bg-gradient-to-r p-4 text-foreground shadow-lg md:p-6">
        <h2 className="text-xl font-bold md:text-2xl">Kedd 15:00-18:00</h2>
        <p className="mt-1 text-xs opacity-90 md:text-sm">
          {programs.length} program várakozik rád!
        </p>
        <div className="mt-3">
          <Button
            as="a"
            href="/osztaly-programok"
            size="sm"
            color="primary"
            variant="solid"
          >
            Szavazz kedvenceidre! 🗳️
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <Input
        type="text"
        placeholder="Keresés program, terem vagy osztály alapján..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        isClearable
        onClear={() => setSearchTerm("")}
      />

      {/* Results count */}
      {searchTerm && (
        <p className="text-sm text-foreground-600">
          {filteredPrograms.length} találat
        </p>
      )}

      {/* Table */}
      <Table
        aria-label="Program táblázat"
        classNames={{
          wrapper: "shadow-md",
          th: "bg-selfprimary-100 text-selfprimary-900 font-semibold",
        }}
      >
        <TableHeader>
          <TableColumn>PROGRAM</TableColumn>
          <TableColumn>TEREM</TableColumn>
          <TableColumn>OSZTÁLY</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Nincs találat">
          {filteredPrograms.map((program, index) => (
            <TableRow key={`${program.room}-${index}`}>
              <TableCell>
                <span className="text-lg font-medium">{program.name}</span>
              </TableCell>
              <TableCell>
                <Chip size="md" color="secondary" variant="flat">
                  {program.room}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip size="md" color="primary" variant="flat">
                  {program.class}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProgramBlock;
