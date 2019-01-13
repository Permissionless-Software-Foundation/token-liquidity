# Create a Dockerized token-liquidity app

#IMAGE BUILD COMMANDS
FROM christroutner/ct-base-ubuntu
MAINTAINER Chris Troutner <chris.troutner@gmail.com>

#Create the user 'token' and add them to the sudo group.
RUN useradd -ms /bin/bash token
RUN adduser token sudo

#Set password to 'password' change value below if you want a different password
RUN echo token:password | chpasswd

#Set the working directory to be the home directory
WORKDIR /home/token

# Setup NPM for non-root global install
# This allows mac-developed code to conveniently run in Linux.
RUN mkdir /home/token/.npm-global
RUN chown -R token .npm-global
RUN echo "export PATH=~/.npm-global/bin:$PATH" >> /home/token/.profile
RUN runuser -l token -c "npm config set prefix '~/.npm-global'"

# Switch to user account.
USER token
# Prep 'sudo' commands.
RUN echo 'password' | sudo -S pwd

# Clone the repository
WORKDIR /home/token
RUN git clone https://github.com/Permissionless-Software-Foundation/token-liquidity

# Switch to the desired branch. `master` is usually stable,
# and `stage` has the most up-to-date changes.
WORKDIR /home/token/token-liquidity
# For development: switch to unstable branch
RUN git checkout unstable

# Install dependencies
RUN npm install

# Copy the wallet file controlling the BCH wallet
COPY wallet.json wallet.json

# Define volume directories
VOLUME /home/token/token-liquidity/logs

# Expose the port the API will be served on.
# MAINNET
EXPOSE 5000
# TESTNET
#EXPOSE 5100

# Start the application.
COPY start-production start-production
CMD ["./start-production"]

#CMD ["npm", "start"]
