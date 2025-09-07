import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  IconButton,
  Divider,
  useColorModeValue,
  Tooltip,
  ButtonGroup,
  Select,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiLink,
  FiImage,
  FiCode,
  FiType,
  FiRotateCcw,
  FiRotateCw,
} from "react-icons/fi";
import { customToastContainerStyle } from "../../../../commons/toastStyles";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Enter description...",
  minHeight = "200px",
}) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const {
    isOpen: isLinkModalOpen,
    onOpen: onLinkModalOpen,
    onClose: onLinkModalClose,
  } = useDisclosure();
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [savedSelection, setSavedSelection] = useState(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const toolbarBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleContentChange();
  };

  const handleKeyDown = (e) => {
    // Handle common shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          executeCommand("bold");
          break;
        case "i":
          e.preventDefault();
          executeCommand("italic");
          break;
        case "u":
          e.preventDefault();
          executeCommand("underline");
          break;
        case "z":
          e.preventDefault();
          executeCommand("undo");
          break;
        case "y":
          e.preventDefault();
          executeCommand("redo");
          break;
      }
    }

    // Handle Enter key for better line breaks
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeCommand("insertHTML", "<br><br>");
    }
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    if (savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }
  };

  const handleLinkInsert = () => {
    saveSelection();
    const selectedText = window.getSelection().toString();
    setLinkText(selectedText || "");
    setLinkUrl("");
    onLinkModalOpen();
  };

  const insertLink = () => {
    if (linkUrl) {
      restoreSelection();
      if (linkText) {
        executeCommand(
          "insertHTML",
          `<a href="${linkUrl}" target="_blank" style="color: #3182ce; text-decoration: underline;">${linkText}</a>`
        );
      } else {
        executeCommand("createLink", linkUrl);
      }
    }
    onLinkModalClose();
    setLinkUrl("");
    setLinkText("");
  };

  const handleImageInsert = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        executeCommand(
          "insertHTML",
          `<img src="${event.target.result}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Uploaded image" />`
        );
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    }
  };

  const handleHeadingChange = (heading) => {
    if (heading) {
      executeCommand("formatBlock", heading);
    }
  };

  const insertTable = () => {
    const tableHTML = `
      <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 1</td>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 2</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 3</td>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 4</td>
        </tr>
      </table>
    `;
    executeCommand("insertHTML", tableHTML);
  };

  return (
    <VStack spacing={0} align="stretch">
      {/* Toolbar */}
      <Box
        bg={toolbarBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderBottom="none"
        borderTopRadius="md"
        p={2}
      >
        <VStack spacing={2}>
          <HStack spacing={2} wrap="wrap">
            {/* Text Formatting */}
            <ButtonGroup size="sm" isAttached variant="outline">
              <Tooltip label="Bold (Ctrl+B)">
                <IconButton
                  icon={<FiBold />}
                  onClick={() => executeCommand("bold")}
                  aria-label="Bold"
                />
              </Tooltip>
              <Tooltip label="Italic (Ctrl+I)">
                <IconButton
                  icon={<FiItalic />}
                  onClick={() => executeCommand("italic")}
                  aria-label="Italic"
                />
              </Tooltip>
              <Tooltip label="Underline (Ctrl+U)">
                <IconButton
                  icon={<FiUnderline />}
                  onClick={() => executeCommand("underline")}
                  aria-label="Underline"
                />
              </Tooltip>
            </ButtonGroup>

            <Divider orientation="vertical" height="32px" />

            {/* Heading */}
            <Select
              size="sm"
              width="120px"
              onChange={(e) => handleHeadingChange(e.target.value)}
              placeholder="Heading"
            >
              <option value="p">Normal</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
            </Select>

            <Divider orientation="vertical" height="32px" />

            {/* Lists */}
            <ButtonGroup size="sm" isAttached variant="outline">
              <Tooltip label="Bullet List">
                <IconButton
                  icon={<FiList />}
                  onClick={() => executeCommand("insertUnorderedList")}
                  aria-label="Bullet List"
                />
              </Tooltip>
              <Tooltip label="Numbered List">
                <IconButton
                  icon={<FiType />}
                  onClick={() => executeCommand("insertOrderedList")}
                  aria-label="Numbered List"
                />
              </Tooltip>
            </ButtonGroup>

            <Divider orientation="vertical" height="32px" />

            {/* Alignment */}
            <ButtonGroup size="sm" isAttached variant="outline">
              <Tooltip label="Align Left">
                <IconButton
                  icon={<FiAlignLeft />}
                  onClick={() => executeCommand("justifyLeft")}
                  aria-label="Align Left"
                />
              </Tooltip>
              <Tooltip label="Align Center">
                <IconButton
                  icon={<FiAlignCenter />}
                  onClick={() => executeCommand("justifyCenter")}
                  aria-label="Align Center"
                />
              </Tooltip>
              <Tooltip label="Align Right">
                <IconButton
                  icon={<FiAlignRight />}
                  onClick={() => executeCommand("justifyRight")}
                  aria-label="Align Right"
                />
              </Tooltip>
            </ButtonGroup>
          </HStack>

          <HStack spacing={2} wrap="wrap">
            {/* Links and Media */}
            <ButtonGroup size="sm" isAttached variant="outline">
              <Tooltip label="Insert Link">
                <IconButton
                  icon={<FiLink />}
                  onClick={handleLinkInsert}
                  aria-label="Insert Link"
                />
              </Tooltip>
              <Tooltip label="Insert Image">
                <IconButton
                  icon={<FiImage />}
                  onClick={handleImageInsert}
                  aria-label="Insert Image"
                />
              </Tooltip>
            </ButtonGroup>

            <Divider orientation="vertical" height="32px" />

            {/* Code */}
            <Tooltip label="Code Block">
              <IconButton
                size="sm"
                icon={<FiCode />}
                onClick={() => executeCommand("formatBlock", "pre")}
                aria-label="Code Block"
                variant="outline"
              />
            </Tooltip>

            <Divider orientation="vertical" height="32px" />

            {/* Undo/Redo */}
            <ButtonGroup size="sm" isAttached variant="outline">
              <Tooltip label="Undo (Ctrl+Z)">
                <IconButton
                  icon={<FiRotateCcw />}
                  onClick={() => executeCommand("undo")}
                  aria-label="Undo"
                />
              </Tooltip>
              <Tooltip label="Redo (Ctrl+Y)">
                <IconButton
                  icon={<FiRotateCw />}
                  onClick={() => executeCommand("redo")}
                  aria-label="Redo"
                />
              </Tooltip>
            </ButtonGroup>

            <Divider orientation="vertical" height="32px" />

            {/* Table */}
            <Tooltip label="Insert Table">
              <Button size="sm" variant="outline" onClick={insertTable}>
                Table
              </Button>
            </Tooltip>
          </HStack>
        </VStack>
      </Box>

      {/* Editor */}
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderBottomRadius="md"
        p={4}
        minHeight={minHeight}
        _focus={{
          outline: "none",
          borderColor: "blue.400",
          boxShadow: "0 0 0 1px #3182ce",
        }}
        _empty={{
          _before: {
            content: `"${placeholder}"`,
            color: "gray.400",
            fontStyle: "italic",
          },
        }}
        sx={{
          "& h1": {
            fontSize: "2xl",
            fontWeight: "bold",
            margin: "16px 0 8px 0",
          },
          "& h2": {
            fontSize: "xl",
            fontWeight: "bold",
            margin: "14px 0 7px 0",
          },
          "& h3": {
            fontSize: "lg",
            fontWeight: "bold",
            margin: "12px 0 6px 0",
          },
          "& h4": {
            fontSize: "md",
            fontWeight: "bold",
            margin: "10px 0 5px 0",
          },
          "& p": { margin: "8px 0" },
          "& ul": { paddingLeft: "20px", margin: "8px 0" },
          "& ol": { paddingLeft: "20px", margin: "8px 0" },
          "& li": { margin: "4px 0" },
          "& pre": {
            backgroundColor: "gray.100",
            padding: "12px",
            borderRadius: "md",
            fontFamily: "monospace",
            margin: "8px 0",
            overflow: "auto",
          },
          "& blockquote": {
            borderLeft: "4px solid #3182ce",
            paddingLeft: "12px",
            margin: "8px 0",
            fontStyle: "italic",
            color: "gray.600",
          },
          "& table": {
            borderCollapse: "collapse",
            width: "100%",
            margin: "10px 0",
          },
          "& td, & th": {
            border: "1px solid #ddd",
            padding: "8px",
            textAlign: "left",
          },
          "& th": { backgroundColor: "gray.100", fontWeight: "bold" },
        }}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* Link Modal */}
      <Modal isOpen={isLinkModalOpen} onClose={onLinkModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Insert Link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Link Text</FormLabel>
                <Input
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                />
              </FormControl>
              <FormControl>
                <FormLabel>URL</FormLabel>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onLinkModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={insertLink}>
              Insert Link
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default RichTextEditor;
