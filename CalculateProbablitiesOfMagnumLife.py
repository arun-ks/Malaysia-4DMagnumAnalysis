import math

def probability_of_matching(k, n, numbers_to_match):
    # Calculate the number of combinations to match exactly k numbers
    matching_combinations = math.comb(numbers_to_match, k) * math.comb(n - numbers_to_match, 8 - k)
    
    # Calculate the total number of combinations
    total_combinations = math.comb(n, 8)
   
    probability = matching_combinations / total_combinations
    return probability

def print_probability_table(n):
    print("Matched Numbers | Probability")
    print("----------------|------------")
    for k in range(1, 9):
        probability = probability_of_matching(k, n, 8)
        print(f"       {k}        |   {probability:.9f}")

total_numbers = 36

print_probability_table(total_numbers)

print(f"\n\nNotice how numbers plummet fast")

