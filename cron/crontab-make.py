#!/usr/bin/env python

import shutil, random, os

full_path = os.path.realpath(__file__)
path, f = os.path.split(full_path)

temp_fname = path + "/crontab-template.txt"
cron_fname = path + "/crontab.txt"
script_dir = path.rpartition("/")[0]

# copy temp to cron
shutil.copy(temp_fname, cron_fname)

cron_file = open(cron_fname, "a")

for i in range(24):
	m = random.randint(0, 59)
	line = str(m) + " " + str(i) + " * * * %s/bot-tweeter.js\n" % script_dir
	cron_file.write(line);
	
cron_file.close()