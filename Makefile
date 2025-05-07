# Name of the output zip file
OUTPUT_ZIP = wellnesspurelife.zip

# Default target
all: zip

# Create a zip file excluding specified files and directories
zip:
	@echo "Zipping project, excluding unnecessary files..."
	@zip -r $(OUTPUT_ZIP) . \
		-x "*.git*" \
		-x "*.next*" \
		-x "env.local" \
		-x "email-server/*" \
		-x "serviceAccountKey.json" \
		-x "node_modules/*"
	@echo "Zip file created: $(OUTPUT_ZIP)"

# Create a zip file excluding unnecessary files *and* image files
zipnoimg:
	@echo "Zipping project without images..."
	@zip -r $(OUTPUT_ZIP) . \
		-x "*.git*" \
		-x "*.next*" \
		-x "env.local" \
		-x "email-server/*" \
		-x "serviceAccountKey.json" \
		-x "node_modules/*" \
		-x "*.png" \
		-x "*.jpg" \
		-x "*.jpeg" \
		-x "*.gif" \
		-x "*.svg" \
		-x "*.webp"
	@echo "Zip file created without images: $(OUTPUT_ZIP)"

# Clean the generated zip file
clean:
	@echo "Cleaning up..."
	@rm -f $(OUTPUT_ZIP)
	@echo "Cleaned up the zip file."
