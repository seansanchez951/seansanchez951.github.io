#!/bin/bash
# Compress an MP3 to fit under a target size (default: 95 MB)
# Usage: ./compress_mp3.sh <input.mp3> [target_mb]

INPUT="$1"
TARGET_MB="${2:-95}"

if [[ -z "$INPUT" ]]; then
  echo "Usage: $0 <input.mp3> [target_mb]"
  exit 1
fi

if [[ ! -f "$INPUT" ]]; then
  echo "Error: file not found: $INPUT"
  exit 1
fi

# Get duration in seconds
DURATION=$(ffprobe -v quiet -print_format json -show_format "$INPUT" \
  | python3 -c "import sys,json; print(float(json.load(sys.stdin)['format']['duration']))")

# Calculate required bitrate (bits / seconds), round down to nearest standard MP3 bitrate
TARGET_BITS=$(echo "$TARGET_MB * 1024 * 1024 * 8" | bc)
RAW_BITRATE=$(echo "scale=0; $TARGET_BITS / $DURATION / 1000" | bc)

# Snap to highest standard bitrate that fits
for BR in 320 256 224 192 160 128 96 64; do
  if [[ $RAW_BITRATE -ge $BR ]]; then
    BITRATE=$BR
    break
  fi
done

BITRATE="${BITRATE:-64}"

# Build output filename
BASENAME=$(basename "$INPUT" .mp3)
DIRNAME=$(dirname "$INPUT")
OUTPUT="${DIRNAME}/${BASENAME}_compressed.mp3"

echo "Input:    $INPUT"
echo "Duration: $(printf '%.0f' $DURATION)s"
echo "Target:   ${TARGET_MB} MB"
echo "Bitrate:  ${BITRATE} kbps"
echo "Output:   $OUTPUT"
echo ""

ffmpeg -i "$INPUT" -codec:a libmp3lame -b:a "${BITRATE}k" -y "$OUTPUT"

# Show result
SIZE_MB=$(du -m "$OUTPUT" | cut -f1)
echo ""
echo "Done. Output size: ${SIZE_MB} MB"
