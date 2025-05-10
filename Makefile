# Name of the output zip file
OUTPUT_ZIP = wellnesspurelife.zip

# Default target
all: zip

# Reset Wi-Fi connection (macOS only)
wifi:
	@echo "Resetting Wi-Fi interface..."
	@if ! networksetup -listallhardwareports | grep -q "Wi-Fi"; then \
		echo "Wi-Fi interface not found."; exit 1; \
	fi
	@WIFI_IF=$$(networksetup -listallhardwareports | awk '/Wi-Fi/{getline; print $$2}'); \
	echo "Disabling Wi-Fi on $$WIFI_IF..."; \
	sudo ifconfig $$WIFI_IF down; \
	sudo networksetup -setnetworkserviceenabled Wi-Fi off; \
	echo "Flushing DNS..."; \
	sudo dscacheutil -flushcache; \
	sudo killall -HUP mDNSResponder; \
	echo "Restarting services..."; \
	sudo pkill -f configd; \
	sudo pkill -f discoveryd 2>/dev/null || true; \
	echo "Re-enabling Wi-Fi on $$WIFI_IF..."; \
	sudo networksetup -setnetworkserviceenabled Wi-Fi on; \
	sudo ifconfig $$WIFI_IF up; \
	echo "Wi-Fi reset complete."

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
