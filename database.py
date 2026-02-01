import pandas as pd
import sqlite3

# i forgot to clean duplicate values

csv = pd.read_csv("Distrowatch_popularity.csv")
df = pd.DataFrame(csv)

try:
    if 'name' not in df.columns:
        raise ValueError("There is no valid column")
    
    names = df['name'].dropna().astype(str).str.strip()

    names = [(n,) for n in names if n]

    if not names:
        raise ValueError("No names in the column (empty!)")
    
    conn = sqlite3.connect("distros.db")
    cur = conn.cursor()

    cur.executemany("INSERT INTO distros (name) VALUES (?)", names)
    conn.commit() # to commit the transaction

except (sqlite3.Error, ValueError) as e:
    print(f"Error : {e}")
finally:
    try:
        conn.close()
    except Exception:
        pass