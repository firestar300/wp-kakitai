import jaconv
import os

def convert_romaji_to_hiragana(input_file, output_file):
    # Read the input file
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Convert each line
    converted_lines = []
    for line in lines:
        # Split the line into kanji and romaji parts
        parts = line.strip().split(' ')
        if len(parts) >= 2:
            kanji = parts[0]
            romaji = parts[1]
            # Convert romaji to hiragana
            hiragana = jaconv.alphabet2kana(romaji)
            converted_lines.append(f"{kanji} {hiragana}")

    # Write to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(converted_lines))

def process_files():
    input_files = [
        "src/data-501-1000.csv",
        "src/data-1001-1500.csv",
        "src/data-1501-2000.csv",
        "src/data-2001-3000.csv",
        "src/data-3001-4000.csv",
        "src/data-4001-5000.csv",
        "src/data-5001-6000.csv"
    ]

    for input_file in input_files:
        if os.path.exists(input_file):
            output_file = input_file.replace('.csv', '-hiragana.csv')
            print(f"Converting {input_file}...")
            convert_romaji_to_hiragana(input_file, output_file)
            print(f"Created {output_file}")
        else:
            print(f"File not found: {input_file}")

if __name__ == "__main__":
    process_files()
