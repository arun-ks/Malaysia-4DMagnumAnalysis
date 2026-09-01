
# Remove duplicates from file and add Header
sort winning_history_4D_Magnum.csv | uniq > _temp_winning_history_4D_Magnum.csv
sed -i '/Number,Meaning,DrawDate,DrawID,PrizeType,PrizeDesc/d' _temp_winning_history_4D_Magnum.csv
sed -i '1i Number,Meaning,DrawDate,DrawID,PrizeType,PrizeDesc,PrizeDescZh' _temp_winning_history_4D_Magnum.csv


# Check if all numbers were extracted
cut -d, -f1 _temp_winning_history_4D_Magnum.csv | sort -ui | grep -v Number  > _temp_ListOfNumbersExtracted
echo Start number : `head -1 _temp_ListOfNumbersExtracted`
echo End number : `tail -1 _temp_ListOfNumbersExtracted`

awk '
{
    present[$1] = 1
}
END {
    print "Missing numbers:"
    for (i = 0; i <= 9999; i++) {
        s = sprintf("%04d", i)
        if (!(s in present)) {
            print s
        }
    }
}
' _temp_ListOfNumbersExtracted

rm -Rf _temp_ListOfNumbersExtracted
#rm -Rf _temp_winning_history_4D_Magnum.csv

mv _temp_winning_history_4D_Magnum.csv winning_history_4D_Magnum.csv
