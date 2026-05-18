"use client";

/**
 * Button component for adding nodes to the workflow canvas.
 * Opens a NodeSelector modal to allow users to choose and add
 * different node types (triggers, AI models, HTTP, messaging) to the editor.
 * 
 * @author Maruf Bepary
 */

import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { NodeSelector } from "@/components/node-selector";
import { Button } from "@/components/ui/button";

export const AddNodeButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <Button
        onClick={() => setSelectorOpen(true)}
        size="icon"
        variant="outline"
        className="bg-background"
      >
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
